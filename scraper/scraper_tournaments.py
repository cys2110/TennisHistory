from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv

tournaments = []
year = 1968

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/scores/results-archive?year={year}")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament-list')))

wrapper = driver.find_element(By.CLASS_NAME, 'tournament-list')
tournament_list = wrapper.find_elements(By.CLASS_NAME, 'results')

for tournament in tournament_list:
    tournaments.append([year, tournament.get_attribute('href')])

driver.quit()

with open('test.csv', 'a', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    for tournament in tournaments:
        writer.writerow(tournament)