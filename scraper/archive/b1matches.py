from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import time
import re

# For no stats matches

year = 1978
draw = 'Best5'

tid = 580
sort_date = '1978-12-25'

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/draws")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

buttons = driver.find_elements(By.CLASS_NAME, 'button')
matches = []

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

for index, button in enumerate(buttons):
    if button.text != 'Previous' and button.text != '':
        button.click()
        time.sleep(1)

        round = driver.find_element(By.CLASS_NAME, f"draw-round-{index}")
        round_header = round.find_element(By.CLASS_NAME, 'draw-header')

        matches_list = round.find_elements(By.CLASS_NAME, 'draw-item')
        match_no = 0

        for match in matches_list:
            match_no += 1

            # Players info
            players = match.find_elements(By.CLASS_NAME, 'name')
            ps = []

            match_info = {
                'id': f"{tid}{year} {button.text} {match_no}",
                'match_no': len(matches) + 1,
                'round': round_header.text
            }

            for player in players:
                try:
                    player_link = player.find_element(By.TAG_NAME, 'a').get_attribute('href')
                    id = re.search('/([a-zA-Z0-9]{4})/', player_link)
                    ps.append(id.group(1))
                except:
                    ps.append(None)

            if ps[0]:
                match_info['p1'] = {}
                match_info['p1']['id'] = ps[0]
            if ps[1]:
                match_info['p2'] = {}
                match_info['p2']['id'] = ps[1]

            # Scores
            scores = match.find_elements(By.CLASS_NAME, 'scores')

            p1 = scores[0].find_elements(By.CLASS_NAME, 'score-item')
            for index, p in enumerate(p1):
                try:
                    if p.text != '' and p.text != '-':
                        match_info['p1'][f"s{index + 1}"] = int(p.text)
                except:
                    spans = p.find_elements(By.TAG_NAME, 'span')
                    match_info['p1'][f"s{index + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['p1'][f"t{index + 1}"] = int(spans[1].text)


            p2 = scores[1].find_elements(By.CLASS_NAME, 'score-item')
            for index, p in enumerate(p2):
                try:
                    if p.text != '' and p.text != '-':
                        match_info['p2'][f"s{index + 1}"] = int(p.text)
                except:
                    spans = p.find_elements(By.TAG_NAME, 'span')
                    match_info['p2'][f"s{index + 1}"] = int(spans[0].text)
                    if len(spans) > 1:
                        match_info['p2'][f"t{index + 1}"] = int(spans[1].text)

            matches.append(match_info)

driver.quit()

def writeToDb(db):
    for match in matches:
        params = {
            'id': int(f"{tid}{year}"),
            'mid': match['id'],
            'round': match['round'],
            'match_no': match['match_no'],
            'date': sort_date
        }

        if match.get('p1') is not None and match.get('p2') is not None:
            s1_properties = {
                's1': match['p1'].get('s1'),
                's2': match['p1'].get('s2'),
                's3': match['p1'].get('s3'),
                's4': match['p1'].get('s4'),
                's5': match['p1'].get('s5')
            }
            s1_query = ', '.join([f"{k}: ${k}" for k, v in s1_properties.items() if v is not None])

            s2_properties = {
                's1': match['p2'].get('s1'),
                's2': match['p2'].get('s2'),
                's3': match['p2'].get('s3'),
                's4': match['p2'].get('s4'),
                's5': match['p2'].get('s5')
            }
            s2_query = ', '.join([f"{k}: ${k}" for k, v in s2_properties.items() if v is not None])

            query = f"""
                MATCH (e:Event {{id: $id}})
                MERGE (p1:Player {{id: $p1}})
                ON CREATE
                SET p1:Update
                MERGE (p2:Player {{id: $p2}})
                ON CREATE
                SET p2:Update
                MERGE (m:Match:Update:{draw} {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(e)
                MERGE (s1:Score:P1 {{id: $score1}})
                MERGE (s2:Score:P2 {{id: $score2}})
                MERGE (p1)-[:SCORED]->(s1)
                MERGE (s1)-[:SCORED]->(m)
                MERGE (p2)-[:SCORED]->(s2)
                MERGE (s2)-[:SCORED]->(m)
            """

            if s1_query:
                query += f" SET s1 += {{{s1_query}}}"

            if s2_query:
                query += f" SET s2 += {{{s2_query}}}"

            params.update({k: v for k, v in s1_properties.items() if v is not None})
            params.update({k: v for k, v in s2_properties.items() if v is not None})
            params['p1'] = match['p1']['id']
            params['p2'] = match['p2']['id']
            params['score1'] = f"{match['id']} {match['p1']['id']}"
            params['score2'] = f"{match['id']} {match['p2']['id']}"

        elif match.get('p1') is not None:
            query = f"""
                MATCH (e:Event {{id: $id}})
                MERGE (p1:Player {{id: $p1}})
                MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date), incomplete: 'B'}})
                MERGE (m)-[:PLAYED]->(e)
                MERGE (s1:Score:P1:Winner {{id: $score1}})
                MERGE (p1)-[:SCORED]->(s1)
                MERGE (s1)-[:SCORED]->(m)
                SET m.incomplete = 'B'
            """

            params['p1'] = match['p1']['id']
            params['score1'] = f"{match['id']} {match['p1']['id']}"

        elif match.get('p2') is not None:
            query = f"""
                MATCH (e:Event {{id: $id}})
                MERGE (p2:Player {{id: $p2}})
                MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(e)
                MERGE (s2:Score:P2:Winner {{id: $score2}})
                MERGE (p2)-[:SCORED]->(s2)
                MERGE (s2)-[:SCORED]->(m)
                SET m.incomplete = 'B'
            """

            params['p2'] = match['p2']['id']
            params['score2'] = f"{match['id']} {match['p2']['id']}"

        else:
            query = f"""
                MATCH (e:Event {{id: $id}})
                MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(e)
            """

        db.run(query, **params)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    with driver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)