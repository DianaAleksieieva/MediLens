import requests

def get_pill_info(pill_name: str) -> str:
    """
    Fetches and formats pill information from the OpenFDA drug label API based on the pill name.
    """
    # Define API URL
    url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:{pill_name}&limit=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        return f"❌ Error fetching data: {str(e)}"

    data = response.json()

    if "results" not in data or not data["results"]:
        return f"❌ No information found for '{pill_name}'."

    info = data["results"][0]

    def get_section(field_name: str, title: str) -> str:
        values = info.get(field_name)
        if values:
            return f"{title}\n" + "\n".join(values)
        return ""

    # Build formatted result
    sections = [
        f"✅ {pill_name.title()}",
        get_section("indications_and_usage", "🧾 Uses:"),
        get_section("active_ingredient", "💊 Active Ingredients:"),
        get_section("inactive_ingredient", "➕ Inactive Ingredients:"),
        get_section("dosage_and_administration", "📋 Directions for Use:"),
        get_section("warnings", "⚠️ Warnings:"),
        get_section("storage_and_handling", "ℹ️ Storage:"),
    ]

    return "\n\n".join([s for s in sections if s]).strip()
