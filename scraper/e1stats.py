from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# For stats matches where winner is 1st in results and stats

tid = 580
year = 2001
matches = ['https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms064', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms065', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms066', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms067', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms068', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms069', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms070', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms071', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms072', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms073', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms074', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms075', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms076', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms077', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms078', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms079', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms080', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms081', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms082', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms083', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms084', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms085', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms086', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms087', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms088', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms089', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms090', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms091', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms092', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms093', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms094', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms095', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms096', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms097', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms098', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms099', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms100', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms101', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms102', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms103', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms104', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms105', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms106', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms107', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms108', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms109', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms110', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms111', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms112', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms113', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms114', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms115', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms116', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms117', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms118', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms119', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms120', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms121', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms122', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms123', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms124', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms125', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms126', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms127', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms032', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms033', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms034', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms035', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms036', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms037', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms038', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms039', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms040', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms041', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms042', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms043', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms044', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms045', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms046', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms047', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms048', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms049', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms050', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms051', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms052', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms053', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms054', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms055', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms056', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms057', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms058', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms059', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms060', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms061', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms062', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms063', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms016', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms017', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms018', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms019', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms020', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms021', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms022', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms023', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms024', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms025', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms026', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms027', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms028', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms029', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms030', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms031', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms008', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms009', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms010', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms011', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms012', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms013', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms014', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms015', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms004', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms005', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms006', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms007', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms002', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms003', 'https://www.atptour.com/en/scores/match-stats/archive/2001/580/ms001']
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
        match_info['loser']['serve1_pts'] = int(loser_serve1[1])

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
        match_info['loser']['ret1'] = int(loser_ret1[1])

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
            SET w += $winner_stats, w:Winner, l += $loser_stats, l:Loser, m.duration_mins = $minutes
            """, winner=match['winner_id'], loser=match['loser_id'], eid=int(f"{tid}{year}"), winner_stats=match['winner'], loser_stats=match['loser'], minutes=match['duration_mins'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)