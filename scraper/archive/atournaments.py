from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

tournaments = []
year = 1993

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/scores/results-archive?year={year}")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament-list')))

wrapper = driver.find_element(By.CLASS_NAME, 'tournament-list')
tournament_list = wrapper.find_elements(By.CLASS_NAME, 'results')

for tournament in tournament_list:
    t = tournament.get_attribute('href').replace("https://www.atptour.com/en/scores/archive/", "").replace(f"/{year}/results", "")
    array = t.split('/')
    tournaments.append(int(f"{array[1]}{year}"))

driver.quit()

load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for t in tournaments:
        result = db.run("""
            MATCH (y:Year {id: $year})
            MERGE (e:Event {id: $id})
            MERGE (e)-[:TOOK_PLACE_IN]->(y)
            """, id=t, year=year)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    with driver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)