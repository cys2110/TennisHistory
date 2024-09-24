from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re

tid = 329
year = 2024
player_entry = []

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/current/x/{tid}/draws")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

round = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div[2]/div[1]/div[2]/div[3]/div/div[3]/div/div[5]/div/div[1]')
matches_list = round.find_elements(By.CLASS_NAME, 'player-info')

for match in matches_list:
    players = match.find_elements(By.CLASS_NAME, 'name')
    dictionary = {}
    for player in players:
        if player.text != 'Bye' and player.text != 'Qualifier':
            link = player.find_element(By.TAG_NAME, 'a').get_attribute('href')
            id = re.search("/([a-zA-Z0-9]{4})/", link)
            dictionary['id'] = id.group(1)
            try:
                status = player.find_element(By.TAG_NAME, 'span')
                if status.text != '':
                    item = status.text.replace('(', '').replace(')', '')
                    if item.isnumeric():
                        dictionary['seed'] = int(item)
                    elif len(item) > 2:
                        if ' ' in item:
                            array = item.split(' ')
                            dictionary['seed'] = int(array[0])
                            dictionary['status'] = array[1]
                        else:
                            dictionary['seed'] = int(item.replace('(', '').replace(') WC', ''))
                            dictionary['status'] = 'WC'
                    else:
                        dictionary['status'] = item
            except:
                continue
            player_entry.append(dictionary)

driver.quit()

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for e in player_entry:
        params = {
            'eid': f"{tid}{year}",
            'pid': e['id']
        }

        if e.get('seed') is not None and e.get('status') is not None:
            query = f"""
                MERGE (p:Player {{id: $pid}})
                MERGE (f:Entry {{id: $eid + ' ' + $pid}})
                SET f.status = $status, f.seed = $seed
                MERGE (p)-[:ENTERED]->(f)
            """

            params['seed'] = e['seed']
            params['status'] = e['status']
        elif e.get('seed') is not None:
            query = f"""
                MERGE (p:Player {{id: $pid}})
                MERGE (f:Entry {{id: $eid + ' ' + $pid}})
                SET f.seed = $seed
                MERGE (p)-[:ENTERED]->(f)
            """

            params['seed'] = e['seed']
        elif e.get('status') is not None:
            query = f"""
                MERGE (p:Player {{id: $pid}})
                MERGE (f:Entry {{id: $eid + ' ' + $pid}})
                SET f.status = $status
                MERGE (p)-[:ENTERED]->(f)
            """
            params['status'] = e['status']
        else:
            query = f"""
                MERGE (p:Player {{id: $pid}})
                MERGE (f:Entry {{id: $eid + ' ' + $pid}})
                MERGE (p)-[:ENTERED]->(f)
            """

        db.run(query, **params)

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)