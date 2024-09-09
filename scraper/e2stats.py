from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# For stats matches where winner is 1st in results and p1 in stats

tid = 438
year = 2021
matches = ['https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms014', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms015', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms004', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms005', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms006', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms007', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms002', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms003', 'https://www.atptour.com/en/scores/stats-centre/archive/2021/438/ms001']
matches_info = []

driver = webdriver.Chrome()

for match in matches:
    try:
        driver.get(match)
        try:
            time.sleep(5)
            WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//*[@id="cf-chl-widget-c1j48"]')))
            box = driver.find_element(By.XPATH, '//*[@id="MDjtu6"]/div/label/input').click()
        except:
            continue

        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'atp_match-stats')))
        time.sleep(10)

        duration = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div/div[3]/div/div[2]/div[2]/div[2]/div[1]/span[2]')
        times = duration.text.split(":")
        minutes = (int(times[0])*60) + int(times[1])

        match_info = {
            'winner': {},
            'loser': {},
            'p1': {},
            'p2': {},
            'duration_mins': minutes
        }

        results = driver.find_elements(By.CLASS_NAME, 'stats-item')
        for index, result in enumerate(results):
            name_link = result.find_element(By.TAG_NAME, 'a')
            name = name_link.get_attribute('href').replace("https://www.atptour.com/en/players/", "").replace("/overview", "").split("/")
            if index == 0:
                match_info['winner_id'] = name[1]
            else:
                match_info['loser_id'] = name[1]

            scores = result.find_elements(By.CLASS_NAME, 'score-item')
            for idx, score in enumerate(scores):
                spans = score.find_elements(By.TAG_NAME, 'span')
                if index == 0:
                    match_info['winner'][f"s{idx + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['winner'][f"t{idx + 1}"] = int(spans[1].text)
                else:
                    match_info['loser'][f"s{idx + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['loser'][f"t{idx + 1}"] = int(spans[1].text)

        p1_stat = driver.find_elements(By.CLASS_NAME, 'player1')
        match_info['p1']['aces'] = int(p1_stat[2].text)
        match_info['p1']['dfs'] = int(p1_stat[4].text)
        winner_serve1 = p1_stat[8].text.split(" ")[0].split("/")
        match_info['p1']['serve1_pts_w'] = int(winner_serve1[0])
        match_info['p1']['serve1_pts'] = int(winner_serve1[1])
        winner_serve2 = p1_stat[10].text.split(" ")[0].split("/")
        match_info['p1']['serve2_pts_w'] = int(winner_serve2[0])
        match_info['p1']['serve2_pts'] = int(winner_serve2[1])
        winner_bps_saved = p1_stat[12].text.split(" ")[0].split("/")
        match_info['p1']['bps_saved'] = int(winner_bps_saved[0])
        match_info['p1']['bps_faced'] = int(winner_bps_saved[1])
        winner_ret1 = p1_stat[18].text.split(" ")[0].split("/")
        match_info['p1']['ret1_w'] = int(winner_ret1[0])
        match_info['p1']['ret1'] = int(winner_ret1[1])
        winner_ret2 = p1_stat[20].text.split(" ")[0].split("/")
        match_info['p1']['ret2_w'] = int(winner_ret2[0])
        match_info['p1']['ret2'] = int(winner_ret2[1])
        winner_bps_converted = p1_stat[22].text.split(" ")[0].split("/")
        match_info['p1']['bps_converted'] = int(winner_bps_converted[0])
        match_info['p1']['bp_opps'] = int(winner_bps_converted[1])

        p2_stat = driver.find_elements(By.CLASS_NAME, 'player2')
        match_info['p2']['aces'] = int(p2_stat[2].text)
        match_info['p2']['dfs'] = int(p2_stat[4].text)
        winner_serve1 = p2_stat[8].text.split(" ")[0].split("/")
        match_info['p2']['serve1_pts_w'] = int(winner_serve1[0])
        match_info['p2']['serve1_pts'] = int(winner_serve1[1])
        winner_serve2 = p2_stat[10].text.split(" ")[0].split("/")
        match_info['p2']['serve2_pts_w'] = int(winner_serve2[0])
        match_info['p2']['serve2_pts'] = int(winner_serve2[1])
        winner_bps_saved = p2_stat[12].text.split(" ")[0].split("/")
        match_info['p2']['bps_saved'] = int(winner_bps_saved[0])
        match_info['p2']['bps_faced'] = int(winner_bps_saved[1])
        winner_ret1 = p2_stat[18].text.split(" ")[0].split("/")
        match_info['p2']['ret1_w'] = int(winner_ret1[0])
        match_info['p2']['ret1'] = int(winner_ret1[1])
        winner_ret2 = p2_stat[20].text.split(" ")[0].split("/")
        match_info['p2']['ret2_w'] = int(winner_ret2[0])
        match_info['p2']['ret2'] = int(winner_ret2[1])
        winner_bps_converted = p2_stat[22].text.split(" ")[0].split("/")
        match_info['p2']['bps_converted'] = int(winner_bps_converted[0])
        match_info['p2']['bp_opps'] = int(winner_bps_converted[1])

        matches_info.append(match_info)
    except:
        print(match)

driver.quit()

load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for match in matches_info:

        result = db.run("""
            MATCH (:Player {id: $winner})-[]-(w:Score)-[]-(m:Match)-[]-(l:Score)-[]-(:Player {id: $loser})
            WHERE (m)-[]-(:Event {id: $eid})
            MATCH (m)-[]-(s1:P1)
            MATCH (m)-[]-(s2:P2)
            SET w += $winner_stats, w:Winner, l += $loser_stats, l:Loser, m.duration_mins = $minutes, s1 += $p1_stats, s2 += $p2_stats
            """, winner=match['winner_id'], loser=match['loser_id'], eid=int(f"{tid}{year}"), winner_stats=match['winner'], loser_stats=match['loser'], minutes=match['duration_mins'], p1_stats=match['p1'], p2_stats=match['p2'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)