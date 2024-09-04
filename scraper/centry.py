from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

players =
# check =
player = players[0]
year = 1994

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/players/x/{player}/player-activity?matchType=Singles&year={year}&tournament=all")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament-footer')))
load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

tournamentIds = []
tournaments = []

wrapper = driver.find_element(By.XPATH, '/html/body/div[6]/div/div[3]/div/div[1]/div[3]/div[3]')
h3s = wrapper.find_elements(By.TAG_NAME, 'h3')
results = wrapper.find_elements(By.CLASS_NAME, 'tournament-footer')

for index, h3 in enumerate(h3s):
    try:
        link = h3.find_element(By.TAG_NAME, 'a')
        href = link.get_attribute('href')
        tournament_id = href.replace("https://www.atptour.com/en/tournaments/", '').replace('/overview', '').split('/')

        array = results[index].text.split(', ')

        dictionary = {
            'tournament': int(f"{tournament_id[-1]}{year}"),
            'points': int(array[0].replace('Points: ', '')),
            'rank': int(array[1].replace('ATP Ranking: ', '')),
            'pm': int(array[2].replace('Prize Money: $', '').replace(',', ''))
        }

        tournaments.append(dictionary)
    except:
        continue

driver.quit()

def writeToDb(db):
    for t in tournaments:
        result = db.run("""
            MATCH (p:Player {id: $pid})
            MATCH (e:Event {id: $eid})
            MERGE (p)-[:PLAYED {points: $points, rank: $rank, pm: $pm}]->(e)
            """, pid=player, eid=t['tournament'], points=t['points'], rank=t['rank'], pm=t['pm'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)