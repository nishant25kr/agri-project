from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import random
from datetime import datetime, timedelta

# ---------------------------------------------------------
# Real commodity prices from data.gov.in (Agmarknet API)
# Endpoint: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
# No auth needed for commodity price data (public dataset)
# ---------------------------------------------------------
AGMARKNET_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
# This is the public API key for data.gov.in (free, no registration for read-only)
AGMARKNET_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aab7efa5b08e79ac8af"

# Commodity name aliases for the API
COMMODITY_ALIASES = {
    "Rice": "Rice",
    "Wheat": "Wheat",
    "Maize": "Maize(White)",
    "Tomato": "Tomato",
    "Potato": "Potato",
    "Onion": "Onion",
    "Cotton": "Cotton",
    "Sugarcane": "Sugarcane",
    "Soybean": "Soyabean",
    "Mustard": "Mustard",
    "Groundnut": "Groundnut",
    "Bajra": "Bajra(Pearl Millet/Cumbu)",
    "Jowar": "Jowar(Sorghum)",
    "Arhar": "Arhar (Tur/Red Gram)(Whole)",
}

# Fallback demo prices (₹/quintal) if API is unavailable
DEMO_PRICES = {
    "Rice":      {"modal": 2200, "min": 1900, "max": 2600, "unit": "Quintal"},
    "Wheat":     {"modal": 2100, "min": 1850, "max": 2400, "unit": "Quintal"},
    "Maize":     {"modal": 1800, "min": 1500, "max": 2100, "unit": "Quintal"},
    "Tomato":    {"modal":  800, "min":  400, "max": 1800, "unit": "Quintal"},
    "Potato":    {"modal": 1200, "min":  900, "max": 1600, "unit": "Quintal"},
    "Onion":     {"modal": 1500, "min":  900, "max": 2400, "unit": "Quintal"},
    "Cotton":    {"modal": 6500, "min": 5800, "max": 7200, "unit": "Quintal"},
    "Sugarcane": {"modal":  350, "min":  320, "max":  400, "unit": "Quintal"},
    "Soybean":   {"modal": 4200, "min": 3800, "max": 4700, "unit": "Quintal"},
    "Mustard":   {"modal": 5200, "min": 4800, "max": 5700, "unit": "Quintal"},
    "Groundnut": {"modal": 5500, "min": 4900, "max": 6200, "unit": "Quintal"},
    "Bajra":     {"modal": 1900, "min": 1600, "max": 2300, "unit": "Quintal"},
    "Jowar":     {"modal": 2100, "min": 1800, "max": 2500, "unit": "Quintal"},
    "Arhar":     {"modal": 6800, "min": 6200, "max": 7400, "unit": "Quintal"},
}

# State name mapping for display
STATE_DISPLAY = {
    "maharashtra": "Maharashtra", "punjab": "Punjab", "haryana": "Haryana",
    "uttar pradesh": "Uttar Pradesh", "up": "Uttar Pradesh",
    "madhya pradesh": "Madhya Pradesh", "mp": "Madhya Pradesh",
    "rajasthan": "Rajasthan", "gujarat": "Gujarat", "karnataka": "Karnataka",
    "andhra pradesh": "Andhra Pradesh", "ap": "Andhra Pradesh",
    "telangana": "Telangana", "west bengal": "West Bengal", "wb": "West Bengal",
    "bihar": "Bihar", "tamil nadu": "Tamil Nadu", "tn": "Tamil Nadu",
    "kerala": "Kerala", "odisha": "Odisha", "assam": "Assam",
    "himachal pradesh": "Himachal Pradesh", "jharkhand": "Jharkhand",
    "chhattisgarh": "Chhattisgarh", "uttarakhand": "Uttarakhand",
}

def get_state_display(raw: str) -> str:
    return STATE_DISPLAY.get(raw.lower().strip(), raw.title())


def fetch_agmarknet_prices(commodity: str, state: str) -> list:
    """
    Attempt to fetch real mandi prices from data.gov.in Agmarknet dataset.
    Returns a list of market records or [] on failure.
    """
    alias = COMMODITY_ALIASES.get(commodity, commodity)
    params = {
        "api-key": AGMARKNET_API_KEY,
        "format": "json",
        "limit": "20",
        "filters[commodity]": alias,
    }
    if state:
        params["filters[state]"] = get_state_display(state)

    try:
        resp = requests.get(AGMARKNET_API_URL, params=params, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            records = data.get("records", [])
            return records
    except Exception:
        pass
    return []



# Real mandi names grouped by state — used for demo fallback data
STATE_MANDIS = {
    "Punjab":           ["Amritsar", "Ludhiana", "Patiala", "Jalandhar", "Bathinda",
                         "Moga", "Ferozepur", "Sangrur", "Fazilka", "Gurdaspur"],
    "Haryana":          ["Karnal", "Panipat", "Ambala", "Rohtak", "Hisar",
                         "Sirsa", "Kurukshetra", "Sonipat", "Fatehabad", "Jind"],
    "Uttar Pradesh":    ["Agra", "Lucknow", "Kanpur", "Varanasi", "Mathura",
                         "Meerut", "Bareilly", "Moradabad", "Aligarh", "Saharanpur"],
    "Maharashtra":      ["Nashik", "Lasalgaon", "Vashi (APMC)", "Pune (APMC)", "Azadpur",
                         "Yeola", "Aurangabad", "Solapur", "Nandgaon", "Kolhapur"],
    "Madhya Pradesh":   ["Indore", "Bhopal", "Ratlam", "Ujjain", "Dewas",
                         "Gwalior", "Sagar", "Jabalpur", "Vidisha", "Hoshangabad"],
    "Rajasthan":        ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur",
                         "Alwar", "Ajmer", "Barmer", "Nagaur", "Pali"],
    "Gujarat":          ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Bhavnagar",
                         "Junagadh", "Mehsana", "Anand", "Gondal", "Unjha"],
    "Karnataka":        ["Bangalore (APMC)", "Hubli", "Belagavi", "Mysuru", "Davangere",
                         "Ballari", "Tumakuru", "Shivamogga", "Vijayapur", "Kalaburagi"],
    "Andhra Pradesh":   ["Guntur", "Kurnool", "Vijayawada", "Visakhapatnam", "Nellore",
                         "Tirupati", "Kadapa", "Anantapur", "Rajam", "Chirala"],
    "Telangana":        ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
                         "Nalgonda", "Sangareddy", "Medak", "Adilabad", "Siddipet"],
    "West Bengal":      ["Kolkata", "Siliguri", "Burdwan", "Krishnanagar", "Midnapore",
                         "Malda", "Bankura", "Barasat", "Hooghly", "Jalpaiguri"],
    "Bihar":            ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur", "Darbhanga",
                         "Purnea", "Hajipur", "Samastipur", "Begusarai", "Ara"],
    "Tamil Nadu":       ["Chennai (Koyambedu)", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli",
                         "Tirunelveli", "Vellore", "Erode", "Thanjavur", "Dharmapuri"],
    "Kerala":           ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam",
                         "Palakkad", "Kottayam", "Malappuram", "Kannur", "Alappuzha"],
    "All India":        ["Azadpur (Delhi)", "Nashik", "Vashi (APMC)", "Ludhiana", "Indore",
                         "Ahmedabad", "Jaipur", "Hyderabad", "Guntur", "Patna"],
}

# Default fallback for states not in the dict
DEFAULT_MANDIS = ["Main Market", "APMC Yard", "City Mandi", "District Mandi",
                  "Wholesale Market", "Grain Market", "Sabzi Mandi", "Agricultural Market"]


def build_demo_data(commodity: str, state: str, num_markets: int = 8) -> dict:
    """Generate realistic-looking fallback demo data with correct state-wise mandis."""
    base = DEMO_PRICES.get(commodity, {"modal": 2000, "min": 1700, "max": 2400, "unit": "Quintal"})
    state_display = get_state_display(state) if state else "All India"

    # Pick mandi names that actually belong to this state
    mandi_pool = STATE_MANDIS.get(state_display, DEFAULT_MANDIS)
    mandi_names = mandi_pool.copy()
    random.shuffle(mandi_names)

    markets = []
    for i in range(min(num_markets, len(mandi_names))):
        variance = random.uniform(-0.12, 0.12)
        modal = int(base["modal"] * (1 + variance))
        min_p = int(modal * random.uniform(0.80, 0.93))
        max_p = int(modal * random.uniform(1.05, 1.20))
        days_ago = random.randint(0, 3)
        date_str = (datetime.now() - timedelta(days=days_ago)).strftime("%d/%m/%Y")
        markets.append({
            "market": mandi_names[i],
            "state": state_display,          # ← always matches the selected state
            "min_price": min_p,
            "max_price": max_p,
            "modal_price": modal,
            "unit": base["unit"],
            "arrival_date": date_str,
        })
    markets.sort(key=lambda x: x["modal_price"], reverse=True)
    return markets



@csrf_exempt
def get_prices(request):
    """
    GET /market/prices/?commodity=Rice&state=Punjab
    Returns mandi price data from Agmarknet (real) or demo fallback.
    """
    if request.method not in ("GET", "POST"):
        return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)

    if request.method == "POST":
        try:
            body = json.loads(request.body)
        except Exception:
            body = {}
        commodity = body.get("commodity", "").strip()
        state = body.get("state", "").strip()
    else:
        commodity = request.GET.get("commodity", "").strip()
        state = request.GET.get("state", "").strip()

    if not commodity:
        return JsonResponse({"success": False, "error": "Commodity is required"}, status=400)

    if commodity not in DEMO_PRICES:
        return JsonResponse({"success": False, "error": f"Unsupported commodity: {commodity}"}, status=400)

    # --- Try real API first ---
    real_records = fetch_agmarknet_prices(commodity, state)
    is_demo = False

    if real_records:
        markets = []
        for r in real_records[:12]:
            try:
                markets.append({
                    "market": r.get("market", r.get("apmc", "Unknown")),
                    "state": r.get("state", ""),
                    "min_price": int(float(r.get("min_price", 0))),
                    "max_price": int(float(r.get("max_price", 0))),
                    "modal_price": int(float(r.get("modal_price", 0))),
                    "unit": "Quintal",
                    "arrival_date": r.get("arrival_date", ""),
                })
            except (ValueError, TypeError):
                continue
        if not markets:
            markets = build_demo_data(commodity, state)
            is_demo = True
    else:
        markets = build_demo_data(commodity, state)
        is_demo = True

    # Compute summary stats
    modal_prices = [m["modal_price"] for m in markets if m["modal_price"] > 0]
    avg_price = int(sum(modal_prices) / len(modal_prices)) if modal_prices else 0
    highest = max(modal_prices) if modal_prices else 0
    lowest = min(modal_prices) if modal_prices else 0

    # Trend: simple comparison vs base demo price
    base_modal = DEMO_PRICES.get(commodity, {}).get("modal", avg_price)
    trend_pct = round(((avg_price - base_modal) / base_modal) * 100, 1) if base_modal else 0
    trend = "up" if trend_pct > 0 else ("down" if trend_pct < 0 else "stable")

    return JsonResponse({
        "success": True,
        "commodity": commodity,
        "state": get_state_display(state) if state else "All India",
        "is_demo": is_demo,
        "summary": {
            "avg_modal": avg_price,
            "highest": highest,
            "lowest": lowest,
            "trend": trend,
            "trend_pct": abs(trend_pct),
            "unit": "₹/Quintal",
            "total_markets": len(markets),
        },
        "markets": markets,
        "fetched_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
    })


@csrf_exempt
def get_commodities(request):
    """GET /market/commodities/ — returns the list of supported commodities."""
    commodities = [
        {"name": "Rice",      "icon": "🌾", "category": "Cereal"},
        {"name": "Wheat",     "icon": "🌾", "category": "Cereal"},
        {"name": "Maize",     "icon": "🌽", "category": "Cereal"},
        {"name": "Bajra",     "icon": "🌾", "category": "Cereal"},
        {"name": "Jowar",     "icon": "🌾", "category": "Cereal"},
        {"name": "Tomato",    "icon": "🍅", "category": "Vegetable"},
        {"name": "Potato",    "icon": "🥔", "category": "Vegetable"},
        {"name": "Onion",     "icon": "🧅", "category": "Vegetable"},
        {"name": "Cotton",    "icon": "🤍", "category": "Cash Crop"},
        {"name": "Sugarcane", "icon": "🎋", "category": "Cash Crop"},
        {"name": "Soybean",   "icon": "🫘", "category": "Oilseed"},
        {"name": "Mustard",   "icon": "🌼", "category": "Oilseed"},
        {"name": "Groundnut", "icon": "🥜", "category": "Oilseed"},
        {"name": "Arhar",     "icon": "🫘", "category": "Pulse"},
    ]
    return JsonResponse({"success": True, "commodities": commodities})


def index(request):
    return JsonResponse({
        "status": "Market Prices API is online",
        "endpoints": {
            "GET /market/prices/?commodity=Rice&state=Punjab": "Fetch mandi prices",
            "GET /market/commodities/": "List supported commodities",
        }
    })
