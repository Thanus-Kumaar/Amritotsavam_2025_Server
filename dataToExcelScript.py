import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()
database_user = os.getenv("DB_USERNAME")
database_password = os.getenv("DB_PWD")

def fetch_registration_data_to_dataframe():
    connection = mysql.connector.connect(
        host='localhost',
        database='amritotsavam_2025',
        user=database_user,
        password=database_password
    )

    try:
        cursor = connection.cursor(dictionary=True)

        # Fetch all registration data with event details
        query = """
            SELECT 
                gd.registrationID AS `Registration ID`,
                ed.eventName AS `Event Name`,
                ed.eventFee AS `Event Fee`,
                CASE 
                    WHEN ed.isGroup = 1 THEN rd.teamName
                    ELSE '-' 
                END AS `Team Name`,
                CASE 
                    WHEN ed.isGroup = 1 THEN gd.roleDescription
                    ELSE '-' 
                END AS `Team Role`,
                ud.userID AS `Participant ID`,
                ud.userName AS `Participant Name`,
                ud.userEmail AS `Participant Email`,
                ud.rollNumber AS `Roll Number`,
                ud.phoneNumber AS `Phone Number`,
                ud.deptID AS `Department ID`,
                ud.academicYear AS `Academic Year`
            FROM groupDetail gd
            JOIN userData ud ON gd.userID = ud.userID
            JOIN eventData ed ON gd.eventID = ed.eventID
            JOIN registrationData rd ON gd.registrationID = rd.registrationID
            WHERE ud.accountStatus = 2
            ORDER BY gd.registrationID, gd.eventID
        """

        cursor.execute(query)
        registration_data = cursor.fetchall()

        df = pd.DataFrame(registration_data)

        # Separate Free and Paid Events
        free_events = df[df["Event Fee"] == 0]
        paid_events = df[df["Event Fee"] > 0]

        os.makedirs("reports", exist_ok=True)

        # Save to Excel (each file has 2 sheets)
        with pd.ExcelWriter("reports/Events.xlsx") as writer:
            free_events[free_events["Team Name"] == "-"].to_excel(writer, sheet_name="Individual Events", index=False)
            free_events[free_events["Team Name"] != "-"].to_excel(writer, sheet_name="Group Events", index=False)

        with pd.ExcelWriter("reports/Workshops.xlsx") as writer:
            paid_events[paid_events["Team Name"] == "-"].to_excel(writer, sheet_name="Individual Workshops", index=False)
            paid_events[paid_events["Team Name"] != "-"].to_excel(writer, sheet_name="Group Workshops", index=False)

        print("Excel files generated successfully!")

    finally:
        cursor.close()
        connection.close()

fetch_registration_data_to_dataframe()
