from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re

# For stats matches where winner is 1st in results and stats

year = 2017
tid = 322
matches = ['https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms017', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms018', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms019', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms021', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms022', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms023', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms024', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms025', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms026', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms028', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms029', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms030', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms008', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms009', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms010', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms011', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms012', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms013', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms014', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms015', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms004', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms005', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms006', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms007', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms002', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms003', 'https://www.atptour.com/en/scores/match-stats/archive/2017/322/ms001']
matches_info = []

driver = webdriver.Chrome()

for match in matches:
    try:
        driver.get(match)
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'ms-content')))
        time.sleep(5)

        duration = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div/div[3]/div/div[2]/div[2]/div[2]/div[1]/span[2]')
        times = duration.text.split(":")
        minutes = (int(times[0])*60) + int(times[1])

        match_info = {
            'winner': {},
            'loser': {},
            'duration_mins': minutes
        }

        results = driver.find_elements(By.CLASS_NAME, 'stats-item')
        for index, result in enumerate(results):
            name = result.find_element(By.TAG_NAME, 'a').get_attribute('href')
            id = re.search("/([a-zA-Z0-9]{4})/", name)
            if index == 0:
                match_info['winner_id'] = id.group(1)
            else:
                match_info['loser_id'] = id.group(1)

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
        try:
            match_info['winner']['aces'] = int(stats_items[2].text)
        except:
            match_info['winner']['aces'] = 0
        try:
            match_info['loser']['aces'] = int(stats_items[3].text)
        except:
            match_info['loser']['aces'] = 0
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
        try:
            match_info['loser']['serve1_pts_w'] = int(loser_serve1[0])
        except:
            match_info['loser']['serve1_pts_w'] = 0
        try:
            match_info['loser']['serve1_pts'] = int(loser_serve1[1])
        except:
            match_info['loser']['serve1_pts'] = 0

        winner_serve2 = stats_items[10].text.replace(")", "").split("(")[1].split("/")
        try:
            match_info['winner']['serve2_pts_w'] = int(winner_serve2[0])
        except:
            match_info['winner']['serve2_pts_w'] = 0
        try:
            match_info['winner']['serve2_pts'] = int(winner_serve2[1])
        except:
            match_info['winner']['serve2_pts'] = 0
        loser_serve2 = stats_items[11].text.replace(")", "").split("(")[1].split("/")
        try:
            match_info['loser']['serve2_pts_w'] = int(loser_serve2[0])
        except:
            match_info['loser']['serve2_pts_w'] = 0
        try:
            match_info['loser']['serve2_pts'] = int(loser_serve2[1])
        except:
            match_info['loser']['serve2_pts'] = 0

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
        try:
            match_info['winner']['ret1_w'] = int(winner_ret1[0])
        except:
            match_info['winner']['ret1_w'] = 0
        match_info['winner']['ret1'] = int(winner_ret1[1])
        loser_ret1 = stats_items[19].text.replace(")", "").split("(")[1].split("/")
        try:
            match_info['loser']['ret1_w'] = int(loser_ret1[0])
        except:
            match_info['loser']['ret1_w'] = 0
        try:
            match_info['loser']['ret1'] = int(loser_ret1[1])
        except:
            match_info['loser']['ret1'] = 0

        winner_ret2 = stats_items[20].text.replace(")", "").split("(")[1].split("/")
        try:
            match_info['winner']['ret2_w'] = int(winner_ret2[0])
        except:
            match_info['winner']['ret2_w'] = 0
        try:
            match_info['winner']['ret2'] = int(winner_ret2[1])
        except:
            match_info['winner']['ret2'] = 0
        loser_ret2 = stats_items[21].text.replace(")", "").split("(")[1].split("/")
        try:
            match_info['loser']['ret2_w'] = int(loser_ret2[0])
        except:
            match_info['loser']['ret2_w'] = 0
        try:
            match_info['loser']['ret2'] = int(loser_ret2[1])
        except:
            match_info['loser']['ret2'] = 0

        matches_info.append(match_info)
    except:
        print(match)

driver.quit()

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for match in matches_info:
        # result = db.run("""
        #     MATCH (:Player {id: $winner})-[]-(:Entry)-[]-(w:Score)-[]-(m:Match)-[]-(l:Score)-[]-(:Entry)-[]-(:Player {id: $loser})
        #     WHERE (m)-[]-(:Round)-[]-(:Event {id: $eid})
        #     SET w += $winner_stats, l += $loser_stats, m.duration_mins = $minutes
        #     """, winner=match['winner_id'], loser=match['loser_id'], eid=int(f"{tid}{year}"), winner_stats=match['winner'], loser_stats=match['loser'], minutes=match['duration_mins'])

        result = db.run("""
            MATCH (:Player {id: $winner})-[]-(:Entry)-[]-(w:Score)-[]-(m:Match)-[]-(l:Score)-[]-(:Entry)-[]-(:Player {id: $loser})
            WHERE (m)-[]-(:Round)-[]-(:Event {id: $eid})
            SET w += $winner_stats, w:Winner, l += $loser_stats, l:Loser, m.duration_mins = $minutes
            """, winner=match['winner_id'], loser=match['loser_id'], eid=int(f"{tid}{year}"), winner_stats=match['winner'], loser_stats=match['loser'], minutes=match['duration_mins'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)