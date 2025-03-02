import mysql.connector
import pandas as pd
from dotenv import load_dotenv
import subprocess, shutil, os

# Load environment variables
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

        # Convert data to DataFrame
        df = pd.DataFrame(registration_data)

        local_folder = "reports"
        if os.path.exists(local_folder):
            print(f"Removing existing local directory: {local_folder}")
            shutil.rmtree(local_folder)

        # Create event and workshop folders
        os.makedirs("reports/events", exist_ok=True)
        os.makedirs("reports/workshops", exist_ok=True)

        # Group data by Event Name
        grouped = df.groupby("Event Name")

        for event_name, event_data in grouped:
            # Remove invalid characters from file name
            safe_event_name = "".join(c if c.isalnum() or c in " _-" else "_" for c in event_name)

            # Determine if it's a workshop or an event
            is_workshop = event_data["Event Fee"].iloc[0] > 0  # Workshops have a fee

            # Set folder based on type
            folder = "reports/workshops" if is_workshop else "reports/events"
            file_path = os.path.join(folder, f"{safe_event_name}.xlsx")

            # Save to Excel
            with pd.ExcelWriter(file_path) as writer:
                event_data.to_excel(writer, sheet_name=safe_event_name, index=False)

            print(f"Saved: {file_path}")

        print("Deleting existing Google Drive folder...")
        delete_cmd = "rclone purge remote:amritotsavam_participants"
        subprocess.run(delete_cmd, shell=True, check=True)
        
        print("Uploading files to Google Drive...")
        cmd = f"rclone copy reports remote:amritotsavam_participants --progress"
        subprocess.run(cmd, shell=True, check=True)
        print("Upload complete!")


        print("All event and workshop reports generated successfully!")

    finally:
        cursor.close()
        connection.close()

# Run the function
fetch_registration_data_to_dataframe()
