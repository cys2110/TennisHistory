from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re
from unidecode import unidecode

tid = 336
year = 2025

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/current/x/{tid}/results")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament')))
matches_list = []
links = []

day = driver.find_element(By.CLASS_NAME, 'atp_accordion-item')
date = day.find_element(By.TAG_NAME, 'h4')
date_obj = datetime.strptime(date.text.split(' Day')[0], "%a, %d %B, %Y")
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

    try:
        link = match.find_element(By.LINK_TEXT, 'Stats').get_attribute('href')
        links.append(link)
    except:
        continue

    matches_list.append(dictionary)

driver.quit()
print(links)

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    # for m in matches_list:
    #     result = db.run("""
    #         MATCH (p:Player {id: $p1id})-[]-(f:Entry)-[]-(p1:Score)-[]-(m:Match)-[]-(p2:Score)-[]-(:Entry)-[]-(:Player {id: $p2id})
    #         WHERE m.id CONTAINS $eid
    #         MATCH (m)-[]-(r:Round)-[]-(e:Event)
    #         MERGE (u:Umpire {id: $umpire})
    #         MERGE (u)-[:UMPIRED]->(m)
    #         SET m.date = date($date), m.court = $court, p1:Winner, p2:Loser
    #         """, p1id=m['p1'], eid=f"{tid}{year}", p2id=m['p2'], umpire=m['umpire'], date=m['date'], court=m['court'])
    for m in matches_list:
        result = db.run("""
            MATCH (p:Player {id: $p1id})-[]-(f:Entry)-[]-(p1:Score)-[]-(m:Match)-[]-(p2:Score)-[]-(:Entry)-[]-(:Player {id: $p2id})
            WHERE m.id CONTAINS $eid
            MATCH (m)-[]-(r:Round)-[]-(e:Event)
            MERGE (u:Umpire {id: $umpire})
            MERGE (u)-[:UMPIRED]->(m)
            SET m.date = date($date), m.court = $court, p1:Winner, p2:Loser
            WITH p, f, m, e
            WHERE m.match_no > 1
            MATCH (m2:Match {match_no: floor(m.match_no / 2)})-[]-(:Round)-[]-(e)
            MERGE (s:Score {id: m2.id + ' ' + p.id})
            MERGE (f)-[:SCORED]->(s)
            MERGE (s)-[:SCORED]->(m2)
            WITH s, m
            FOREACH (ignoreMe IN CASE WHEN m.match_no % 2 = 1 THEN [1] ELSE [] END |
            SET s:P2)
            FOREACH (ignoreMe IN CASE WHEN m.match_no % 2 = 0 THEN [1] ELSE [] END |
            SET s:P1)
            """, p1id=m['p1'], eid=f"{tid}{year}", p2id=m['p2'], umpire=m['umpire'], date=m['date'], court=m['court'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)