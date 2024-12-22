from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re

# For stats matches where p1 first in results and in stats

tid = 7696
year = 2024
matches = ['https://www.atptour.com/en/scores/stats-centre/archive/2024/7696/ms003', 'https://www.atptour.com/en/scores/stats-centre/archive/2024/7696/ms002']
matches_info = []

driver = webdriver.Chrome()

for match in matches:
    try:
        driver.get(match)
        time.sleep(10)

        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'wrapper')))


        duration = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div/div[3]/div/div[2]/div[2]/div[2]/div[1]/span[2]')
        times = duration.text.split(":")
        minutes = (int(times[0])*60) + int(times[1])

        match_info = {
            'p1': {},
            'p2': {},
            'duration_mins': minutes
        }

        results = driver.find_elements(By.CLASS_NAME, 'stats-item')
        for index, result in enumerate(results):
            name = result.find_element(By.TAG_NAME, 'a').get_attribute('href')
            id = re.search('/([a-zA-Z0-9]{4})/', name)
            if index == 0:
                match_info['p1_id'] = id.group(1)
            else:
                match_info['p2_id'] = id.group(1)

            scores = result.find_elements(By.CLASS_NAME, 'score-item')
            for idx, score in enumerate(scores):
                spans = score.find_elements(By.TAG_NAME, 'span')
                if index == 0:
                    match_info['p1'][f"s{idx + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['p1'][f"t{idx + 1}"] = int(spans[1].text)
                        if int(spans[1].text) < 6:
                            match_info['p2'][f"t{idx + 1}"] = 7
                        else:
                            match_info['p2'][f"t{idx + 1}"] = int(spans[1].text) + 2
                else:
                    match_info['p2'][f"s{idx + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['p2'][f"t{idx + 1}"] = int(spans[1].text)
                        if int(spans[1].text) < 6:
                            match_info['p1'][f"t{idx + 1}"] = 7
                        else:
                            match_info['p1'][f"t{idx + 1}"] = int(spans[1].text) + 2

        p1_stat = driver.find_elements(By.CLASS_NAME, 'player1')
        match_info['p1']['aces'] = int(p1_stat[2].text)
        match_info['p1']['dfs'] = int(p1_stat[4].text)
        p1_serve1 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[8].text)
        match_info['p1']['serve1_pts_w'] = int(p1_serve1.group(1))
        match_info['p1']['serve1_pts'] = int(p1_serve1.group(2))
        p1_serve2 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[10].text)
        match_info['p1']['serve2_pts_w'] = int(p1_serve2.group(1))
        match_info['p1']['serve2_pts'] = int(p1_serve2.group(2))
        p1_bps_saved = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[12].text)
        match_info['p1']['bps_saved'] = int(p1_bps_saved.group(1))
        match_info['p1']['bps_faced'] = int(p1_bps_saved.group(2))
        p1_ret1 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[18].text)
        match_info['p1']['ret1_w'] = int(p1_ret1.group(1))
        match_info['p1']['ret1'] = int(p1_ret1.group(2))
        p1_ret2 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[20].text)
        match_info['p1']['ret2_w'] = int(p1_ret2.group(1))
        match_info['p1']['ret2'] = int(p1_ret2.group(2))
        p1_bps_converted = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[22].text)
        match_info['p1']['bps_converted'] = int(p1_bps_converted.group(1))
        match_info['p1']['bp_opps'] = int(p1_bps_converted.group(2))

        p2_stat = driver.find_elements(By.CLASS_NAME, 'player2')
        match_info['p2']['aces'] = int(p2_stat[2].text)
        match_info['p2']['dfs'] = int(p2_stat[4].text)
        p2_serve1 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[8].text)
        match_info['p2']['serve1_pts_w'] = int(p2_serve1.group(1))
        match_info['p2']['serve1_pts'] = int(p2_serve1.group(2))
        p2_serve2 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[10].text)
        match_info['p2']['serve2_pts_w'] = int(p2_serve2.group(1))
        match_info['p2']['serve2_pts'] = int(p2_serve2.group(2))
        p2_bps_saved = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[12].text)
        match_info['p2']['bps_saved'] = int(p2_bps_saved.group(1))
        match_info['p2']['bps_faced'] = int(p2_bps_saved.group(2))
        p2_ret1 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[18].text)
        match_info['p2']['ret1_w'] = int(p2_ret1.group(1))
        match_info['p2']['ret1'] = int(p2_ret1.group(2))
        p2_ret2 = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[20].text)
        match_info['p2']['ret2_w'] = int(p2_ret2.group(1))
        match_info['p2']['ret2'] = int(p2_ret2.group(2))
        p2_bps_converted = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[22].text)
        match_info['p2']['bps_converted'] = int(p2_bps_converted.group(1))
        match_info['p2']['bp_opps'] = int(p2_bps_converted.group(2))
        try:
            p1_net = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p1_stat[26].text)
            match_info['p1']['net_w'] = int(p1_net.group(1))
            match_info['p1']['net'] = int(p1_net.group(2))
            match_info['p1']['winners'] = int(p1_stat[28].text)
            match_info['p1']['ues'] = int(p1_stat[30].text)
            p2_net = re.search(r'\b(\d{1,2})/(\d{1,2})\b', p2_stat[26].text)
            match_info['p2']['net_w'] = int(p2_net.group(1))
            match_info['p2']['net'] = int(p2_net.group(2))
            match_info['p2']['winners'] = int(p2_stat[28].text)
            match_info['p2']['ues'] = int(p2_stat[30].text)
        except:
            pass
        try:
            p1_serves = driver.find_elements(By.CLASS_NAME, 'speedkmh1')
            p2_serves = driver.find_elements(By.CLASS_NAME, 'speedkmh2')
            match_info['p1']['max_speed_kph'] = int(re.search(r'\b(\d{3})\b', p1_serves[0].text).group())
            match_info['p1']['avg_sv1_kph'] = int(re.search(r'\b(\d{3})\b', p1_serves[2].text).group())
            match_info['p1']['avg_sv2_kph'] = int(re.search(r'\b(\d{3})\b', p1_serves[4].text).group())
            match_info['p2']['max_speed_kph'] = int(re.search(r'\b(\d{3})\b', p2_serves[0].text).group())
            match_info['p2']['avg_sv1_kph'] = int(re.search(r'\b(\d{3})\b', p2_serves[2].text).group())
            match_info['p2']['avg_sv2_kph'] = int(re.search(r'\b(\d{3})\b', p2_serves[4].text).group())
        except:
            pass

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

        result = db.run("""
            MATCH (:Player {id: $p1})-[]-(:Entry)-[]-(s1:P1)-[]-(m:Match)-[]-(s2:P2)-[]-(:Entry)-[]-(:Player {id: $p2})
            WHERE (m)-[]-(:Round {round: 'Final'})-[]-(:Event {id: $eid})
            SET m.duration_mins = $minutes, s1 += $p1_stats, s2 += $p2_stats
            """, p1=match['p1_id'], p2=match['p2_id'], eid=int(f"{tid}{year}"), minutes=match['duration_mins'], p1_stats=match['p1'], p2_stats=match['p2'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)