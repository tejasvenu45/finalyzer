import csv
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]  
transactions_collection = db["transactions"]

user_id = ObjectId("USER_ID_HERE")

csv_file_path = "C:\Users\Rahul Sivakumar\Downloads\Sample_Bank_Statement_1000_Transactions.xlsx"  

def parse_transaction(row):
    debit = row.get("Debit(INR)", "").strip()
    credit = row.get("Credit(INR)", "").strip()

    if debit:
        transaction_type = "expense"
        amount = debit
    elif credit:
        transaction_type = "income"
        amount = credit
    else:
        return None  

    try:
        date_obj = datetime.strptime(row["Date"], "%d-%m-%Y")
    except ValueError:
        try:
            date_obj = datetime.strptime(row["Date"], "%Y-%m-%d")
        except ValueError:
            print(f"Invalid date format for row: {row}")
            return None

    return {
        "type": transaction_type,
        "amount": amount,
        "description": row.get("description", "").strip(),
        "date": date_obj,
        "user": user_id,
        "category": row.get("category", "").strip(),
        "isRecurring": False,
    }

with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    transactions = []

    for row in reader:
        transaction = parse_transaction(row)
        if transaction:
            transactions.append(transaction)

    if transactions:
        result = transactions_collection.insert_many(transactions)
        print(f"Inserted {len(result.inserted_ids)} transactions.")
    else:
        print("No valid transactions to insert.")