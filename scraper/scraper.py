from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import time
import re

tid = 337
draw = 'Best3'
year = 2024

driver = webdriver.Chrome()
load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')
URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

matches = []

def addEvent():
    driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/draws")
    WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

    buttons = driver.find_elements(By.CLASS_NAME, 'button')

    for index, button in enumerate(buttons):
        if index != 0 and index != len(buttons) - 1:
            button.click()
            time.sleep(1)

            round = driver.find_element(By.CLASS_NAME, f"draw-round-{index}").find_element(By.CLASS_NAME, 'draw-header')
            matches_list = driver.find_element(By.CLASS_NAME, f"draw-round-{index}").find_elements(By.CLASS_NAME, 'draw-item')
            match_no = 0
            match_number = 0
            if round.text == 'Final':
                match_number = 0
            elif round.text == 'Semifinals':
                match_number = 1
            elif round.text == 'Quarterfinals':
                match_number = 3
            elif round.text == 'Round of 16':
                match_number = 7
            elif round.text == 'Round of 32':
                match_number = 15
            elif round.text == 'Round of 64':
                match_number = 31
            else:
                match_number = 63

            for match in matches_list:
                match_no += 1
                match_number += 1

                # Players info
                players = match.find_elements(By.CLASS_NAME, 'name')

                match_info = {
                    'id': f"{tid}{year} {button.text} {match_no}",
                    'match_no': match_number,
                    'round': f"{tid}{year} {button.text}",
                    'p1': {},
                    'p2': {},
                    'bye': False
                }

                if players[0].text == 'Bye':
                    match_info['bye'] = True
                elif players[0].text == 'Qualifier' or players[0].text == 'TBA':
                    pass
                else:
                    p1_id = players[0].find_element(By.TAG_NAME, 'a').get_attribute('href')
                    match_info['p1']['id'] = re.search("/([a-zA-Z0-9]{4})/", p1_id).group(1)
                    try:
                        status = players[0].find_element(By.TAG_NAME, 'span')
                        if status.text != '':
                            item = status.text.replace('(', '').replace(')', '')
                            if item.isnumeric():
                                match_info['p1']['seed'] = int(item)
                            elif len(item) > 2:
                                if ' ' in item:
                                    array = item.split(' ')
                                    match_info['p1']['seed'] = int(array[0])
                                    match_info['p1']['status'] = array[1]
                                else:
                                    match_info['p1']['seed'] = int(item.replace('(', '').replace(') WC', ''))
                                    match_info['p1']['status'] = 'WC'
                            else:
                                match_info['p1']['status'] = item
                    except:
                        pass

                if players[1].text == 'Bye':
                    match_info['bye'] = True
                elif players[1].text == 'Qualifier' or players[1].text == 'TBA':
                    pass
                else:
                    p2_id = players[1].find_element(By.TAG_NAME, 'a').get_attribute('href')
                    match_info['p2']['id'] = re.search("/([a-zA-Z0-9]{4})/", p2_id).group(1)
                    try:
                        status = players[1].find_element(By.TAG_NAME, 'span')
                        if status.text != '':
                            item = status.text.replace('(', '').replace(')', '')
                            if item.isnumeric():
                                match_info['p2']['seed'] = int(item)
                            elif len(item) > 2:
                                if ' ' in item:
                                    array = item.split(' ')
                                    match_info['p2']['seed'] = int(array[0])
                                    match_info['p2']['status'] = array[1]
                                else:
                                    match_info['p2']['seed'] = int(item.replace('(', '').replace(') WC', ''))
                                    match_info['p2']['status'] = 'WC'
                            else:
                                match_info['p2']['status'] = item
                    except:
                        pass

                matches.append(match_info)

addEvent()

driver.quit()

def addEventToDb(db):
    for match in matches:
        params = {
            'eid': int(f"{tid}{year}"),
            'mid': match['id'],
            'round': match['round'],
            'match_no': match['match_no']
        }

        query = f"""
            MATCH (e:Event {{id: $eid}})
            MATCH (r:Round {{id: $round}})
            MERGE (m:Match:Update:{draw} {{id: $mid, match_no: $match_no}})
            MERGE (m)-[:PLAYED]->(r)
        """

        if match['bye'] == True:
            query += f"""SET m.incomplete = 'B' REMOVE m:{draw}"""

        if match.get('p1') is not None  and match['p1'].get('id') is not None:
            query += f"""
                MERGE (p1:Player {{id: $p1id}})
                ON CREATE SET p1:Update
                MERGE (f1:Entry {{id: $entry1}})
                MERGE (p1)-[:ENTERED]->(f1)
                MERGE (s1:Score:P1 {{id: $score1}})
                MERGE (f1)-[:SCORED]->(s1)
                MERGE (s1)-[:SCORED]->(m)
            """
            params['p1id'] = match['p1']['id']
            params['entry1'] = f"{tid}{year} {match['p1']['id']}"
            params['score1'] = f"{match['id']} {match['p1']['id']}"

            if match['p1'].get('seed') is not None:
                query += f"""
                    SET f1.seed = $p1seed
                    MERGE (f1)-[:SEEDED]->(e)
                """
                params['p1seed'] = match['p1']['seed']

            if match['p1'].get('status') is not None:
                query += f"""
                    SET f1.status = $p1status
                """
                params['p1status'] = match['p1']['status']

        if match.get('p2') is not None and match['p2'].get('id') is not None:
            query += f"""
                MERGE (p2:Player {{id: $p2id}})
                ON CREATE SET p2:Update
                MERGE (f2:Entry {{id: $entry2}})
                MERGE (p2)-[:ENTERED]->(f2)
                MERGE (s2:Score:P2 {{id: $score2}})
                MERGE (f2)-[:SCORED]->(s2)
                MERGE (s2)-[:SCORED]->(m)
            """
            params['p2id'] = match['p2']['id']
            params['entry2'] = f"{tid}{year} {match['p2']['id']}"
            params['score2'] = f"{match['id']} {match['p2']['id']}"

            if match['p2'].get('seed') is not None:
                query += f"""
                    SET f2.seed = $p2seed
                    MERGE (f2)-[:SEEDED]->(e)
                """
                params['p2seed'] = match['p2']['seed']

            if match['p2'].get('status') is not None:
                query += f"""
                    SET f2.status = $p2status
                """
                params['p2status'] = match['p2']['status']

        db.run(query, **params)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    with driver.session(database="neo4j") as session:
        records = session.execute_write(addEventToDb)