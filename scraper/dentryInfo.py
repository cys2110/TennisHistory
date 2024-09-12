from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

tid = 321
year = 2023
player_entry = []

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/draws")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

button = driver.find_element(By.CLASS_NAME, 'button-round-1')
button.click()
time.sleep(1)

round = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[3]/div/div[5]/div/div[1]/div[2]')
matches_list = round.find_elements(By.CLASS_NAME, 'draw-item')

for match in matches_list:
    players = match.find_elements(By.CLASS_NAME, 'name')
    for player in players:
        try:
            status = player.find_element(By.TAG_NAME, 'span')
            if status.text != '':
                link = player.find_element(By.TAG_NAME, 'a')
                href = link.get_attribute('href')

                id = (href.replace("https://www.atptour.com/en/players/", '').replace("/overview", '')).split('/')

                item = status.text.replace('(', '').replace(')', '')
                dictionary = {
                    'id': id[1]
                }
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
                player_entry.append(dictionary)
        except:
            continue

load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for e in player_entry:
        seed = e.get('seed', None)
        status = e.get('status', None)

        result = db.run("""
            MATCH (p:Player {id: $pid})-[t:PLAYED]-(e:Event {id: $eid})
            SET t.status = $status, t.seed = $seed
            """, pid=e['id'], eid=int(f"{tid}{year}"), seed=seed, status=status)

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)