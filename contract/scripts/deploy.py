from brownie import Calculator
from scripts.helpers import get_account

def deploy_calc():
    account = get_account()
    calc = Calculator.deploy({"from": account})
    print(f"Deployed to {calc.address}")

def main():
    deploy_calc()