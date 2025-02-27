from flask import Flask
import http.client

app = Flask(__name__)

@app.route('/')
def get_balance():
    conn = http.client.HTTPSConnection("api.deepseek.com")
    payload = ''
    headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer sk-197d795c9bbb41cda7aaa568a9d6f178'  # Your actual API token
    }
    conn.request("GET", "/user/balance", payload, headers)

    # Handle response
    try:
        res = conn.getresponse()
        if res.status == 200:
            data = res.read()
            return data.decode("utf-8")  # Return the balance as response
        else:
            return f"Error: {res.status} - {res.reason}"
    except Exception as e:
        return f"An error occurred: {e}"
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
