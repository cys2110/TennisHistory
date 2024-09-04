from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# For stats matches where winner is 1st in results and stats

tid = 451
year = 1994
matches = ['https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms016', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms017', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms018', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms019', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms020', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms021', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms022', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms023', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms024', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms025', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms026', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms027', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms028', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms029', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms030', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms031', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms008', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms009', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms010', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms011', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms012', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms013', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms014', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms015', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms004', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms005', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms006', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms007', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms002', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms003', 'https://www.atptour.com/en/scores/match-stats/archive/1994/451/ms001']
matches_info = []

driver = webdriver.Chrome()

for match in matches:
    try:
        driver.get(match)
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'ms-content')))
        time.sleep(5)

        match_info = {
            'winner': {},
            'loser': {}
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

        stats_items = driver.find_elements(By.CLASS_NAME, 'value')
        match_info['winner']['aces'] = int(stats_items[2].text)
        match_info['loser']['aces'] = int(stats_items[3].text)
        try:
            match_info['winner']['dfs'] = int(stats_items[4].text)
        except:
            match_info['winner']['dfs'] = 0
        try:
            match_info['loser']['dfs'] = int(stats_items[5].text)
        except:
            match_info['loser']['dfs'] = 0

        winner_serve1 = stats_items[8].text.replace(")", "").split("(")[1].split("/")
        match_info['winner']['serve1_pts_w'] = int(winner_serve1[0])
        match_info['winner']['serve1_pts'] = int(winner_serve1[1])
        loser_serve1 = stats_items[9].text.replace(")", "").split("(")[1].split("/")
        match_info['loser']['serve1_pts_w'] = int(loser_serve1[0])
        match_info['loser']['serve1_pts'] = int(loser_serve1[1])

        winner_serve2 = stats_items[10].text.replace(")", "").split("(")[1].split("/")
        match_info['winner']['serve2_pts_w'] = int(winner_serve2[0])
        match_info['winner']['serve2_pts'] = int(winner_serve2[1])
        loser_serve2 = stats_items[11].text.replace(")", "").split("(")[1].split("/")
        match_info['loser']['serve2_pts_w'] = int(loser_serve2[0])
        match_info['loser']['serve2_pts'] = int(loser_serve2[1])

        try:
            winner_bps_saved = stats_items[12].text.replace(")", "").split("(")[1].split("/")
            match_info['winner']['bps_saved'] = int(winner_bps_saved[0])
            match_info['winner']['bps_faced'] = int(winner_bps_saved[1])
            match_info['loser']['bps_converted'] = int(winner_bps_saved[1])-int(winner_bps_saved[0])
            match_info['loser']['bp_opps'] = int(winner_bps_saved[1])
        except:
            match_info['winner']['bps_saved'] = 0
            match_info['winner']['bps_faced'] = 0
            match_info['loser']['bps_converted'] = 0
            match_info['loser']['bp_opps'] = 0
        try:
            loser_bps_saved = stats_items[13].text.replace(")", "").split("(")[1].split("/")
            match_info['loser']['bps_saved'] = int(loser_bps_saved[0])
            match_info['loser']['bps_faced'] = int(loser_bps_saved[1])
            match_info['winner']['bps_converted'] = int(loser_bps_saved[1])-int(loser_bps_saved[0])
            match_info['winner']['bp_opps'] = int(loser_bps_saved[1])
        except:
            match_info['loser']['bps_saved'] = 0
            match_info['loser']['bps_faced'] = 0
            match_info['winner']['bps_converted'] = 0
            match_info['winner']['bp_opps'] = 0

        winner_ret1 = stats_items[18].text.replace(")", "").split("(")[1].split("/")
        match_info['winner']['ret1_w'] = int(winner_ret1[0])
        match_info['winner']['ret1'] = int(winner_ret1[1])
        loser_ret1 = stats_items[19].text.replace(")", "").split("(")[1].split("/")
        match_info['loser']['ret1_w'] = int(loser_ret1[0])
        match_info['loser']['ret1'] = int(loser_ret1[1])

        winner_ret2 = stats_items[20].text.replace(")", "").split("(")[1].split("/")
        match_info['winner']['ret2_w'] = int(winner_ret2[0])
        match_info['winner']['ret2'] = int(winner_ret2[1])
        loser_ret2 = stats_items[21].text.replace(")", "").split("(")[1].split("/")
        match_info['loser']['ret2_w'] = int(loser_ret2[0])
        match_info['loser']['ret2'] = int(loser_ret2[1])

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
            SET w += $winner_stats, w:Winner, l += $loser_stats, l:Loser
            """, winner=match['winner_id'], loser=match['loser_id'], eid=int(f"{tid}{year}"), winner_stats=match['winner'], loser_stats=match['loser'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)