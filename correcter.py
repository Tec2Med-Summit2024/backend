# import pandas as pd

# # Load the CSV files into DataFrames
# partners_df = pd.read_csv('partners.csv').astype({'partner_id': 'str'})
# relationships_df = pd.read_csv('relationships.csv')

# # Create a dictionary to map partner_id to username
# partner_id_to_username = dict(zip(partners_df['partner_id'], partners_df['username']))

# # Update the relationships in relationships_df
# # For FOLLOWS: change EndNode (partner_id to username)
# follows_mask = relationships_df['Relationship'] == 'FOLLOWS'
# relationships_df.loc[follows_mask, 'EndNode'] = relationships_df.loc[follows_mask, 'EndNode'].map(partner_id_to_username)

# # For HOSTS: change StartNode (partner_id to username)
# hosts_mask = relationships_df['Relationship'] == 'HOSTS'
# relationships_df.loc[hosts_mask, 'StartNode'] = relationships_df.loc[hosts_mask, 'StartNode'].map(partner_id_to_username)

# # Save the updated relationships back to a new CSV
# relationships_df.to_csv('updated_relationships.csv', index=False)

# print("Relationships updated and saved to 'updated_relationships.csv'")

# import pandas as pd

# # Load the questions.csv file into a DataFrame
# questions_df = pd.read_csv('questions.csv')

# # Create the new merged column by concatenating question_id and event_id as f'{question_id}q{event_id}'
# questions_df['question_id'] = questions_df['question_id'].astype(str) + 'q' + questions_df['event_id'].astype(str)

# questions_df.drop(columns=['event_id'], inplace=True)

# # Save the updated DataFrame to a new CSV file
# questions_df.to_csv('questions_with_merged_id.csv', index=False)

# print("Merged question_id and event_id, saved to 'questions_with_merged_id.csv'")

# import pandas as pd

# # Load the CSV files into DataFrames
# questions_df = pd.read_csv('questions.csv').astype({'question_id': 'str', 'event_id': 'str'})
# relationships_df = pd.read_csv('updated_relationships.csv')

# # Create a mapping from question_id to the merged_id (f'{question_id}q{event_id}')
# questions_df['merged_id'] = questions_df['question_id'].astype(str) + 'q' + questions_df['event_id'].astype(str)
# question_id_to_merged = dict(zip(questions_df['question_id'], questions_df['merged_id']))

# # Update StartNode for ASKED_IN relationships
# asked_in_mask = relationships_df['Relationship'] == 'ASKED_IN'
# relationships_df.loc[asked_in_mask, 'StartNode'] = relationships_df.loc[asked_in_mask, 'StartNode'].map(question_id_to_merged)

# # Save the updated relationships back to a new CSV
# relationships_df.to_csv('updated_relationships.csv', index=False)

# print("Updated StartNode for ASKED_IN relationships and saved to 'updated_relationships.csv'")

import pandas as pd

# Load the updated_relationships.csv file into a DataFrame
relationships_df = pd.read_csv('updated_relationships.csv')

# Add an Id column with the row numbers (starting from 1)
relationships_df['Id'] = range(1, len(relationships_df) + 1)

# Save the updated DataFrame back to a new CSV file
relationships_df.to_csv('relationships_with_id.csv', index=False)

print("Added 'Id' column and saved to 'relationships_with_id.csv'")
