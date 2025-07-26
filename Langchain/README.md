📁 Project Structure

MediLens/
├── main.py         # Main script to run the assistant
├── functions/
│   └── get_pill_info.py          # Helper function for fetching FDA drug data
├── requirements.txt              # List of required Python packages
├── .env                          # Environment variables (API keys, etc.)
└── .gitignore                    # Ignored files and folders

⚙️ Setup Instructions
Clone the repository

git clone https://github.com/DianaAleksieieva/MediLens.git
cd MediLens
Create and activate a virtual environment (optional but recommended)

python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
Install dependencies

pip install -r requirements.txt
Create a .env file

Add your environment variables (e.g., API keys) in a .env file:


FDA_API_KEY=your_fda_api_key_here
OPENAI_API_KEY=your_openai_key_here
Run the project

python MediLens-LangChain.py
🧪 Example Usage
# Initial input: pill name (from image)
messages = [{"role": "user", "content": "Eczema Real Relief"}]
state = {"messages": messages, "pill_name": None}

result = graph.invoke(state)
print("🤖", result["messages"][-1]["content"])

# Follow-up: user asks a specific question about the pill
messages = result["messages"] + [{"role": "user", "content": "Can a child of 8 years take this pill?"}]
state = {"messages": messages, "pill_name": result["pill_name"]}

result2 = graph.invoke(state)
last_message = result2["messages"][-1]

# Output result
print("🤖", last_message.content if hasattr(last_message, "content") else last_message["content"])

![Example Output](example-output.png)

📄 Notes
functions/get_pill_info.py contains a helper function that performs the FDA API call.

You can expand this project by connecting it to a chatbot frontend or integrating more data sources.