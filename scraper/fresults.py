from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re
from unidecode import unidecode

tid = 4713
year = 2024

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/results")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament')))
matches_list = []

days = driver.find_elements(By.CLASS_NAME, 'atp_accordion-item')

for i, day in enumerate(days):
    date = day.find_element(By.TAG_NAME, 'h4')
    date_obj = datetime.strptime(date.text.split(' Day')[0], "%a, %d %B, %Y")
    if i > 0:
        date.click()
        time.sleep(1)
    matches = day.find_elements(By.CLASS_NAME, 'match')

    for match in matches:
        round = match.find_element(By.CLASS_NAME, 'match-header')
        round_name = round.find_element(By.TAG_NAME, 'strong')
        round_array = round_name.text.split(' - ')
        umpire = match.find_element(By.CLASS_NAME, 'match-umpire')
        players = match.find_elements(By.CLASS_NAME, 'name')
        dictionary = {
            'date': date_obj.strftime("%Y-%m-%d"),
            'court': round_array[1].title(),
            'umpire': unidecode(umpire.text.replace('Ump: ', ''))
        }

        for idx, player in enumerate(players):
            link = player.find_element(By.TAG_NAME, 'a').get_attribute('href')
            id = re.search("/([a-zA-Z0-9]{4})/", link)
            dictionary[f"p{idx + 1}"] = id.group(1)

        matches_list.append(dictionary)

driver.quit()

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for m in matches_list:
        result = db.run("""
            MATCH (:Player {id: $p1id})-[]-(:Entry)-[]-(p1:Score)-[]-(m:Match)-[]-(p2:Score)-[]-(:Entry)-[]-(:Player {id: $p2id})
            WHERE m.id CONTAINS $eid
            MATCH (u:Umpire {id: $umpire})
            MERGE (u)-[:UMPIRED]->(m)
            SET m.date = date($date), m.court = $court, p1:Winner, p2:Loser
            """, p1id=m['p1'], eid=f"{tid}{year}", p2id=m['p2'], umpire=m['umpire'], date=m['date'], court=m['court'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)