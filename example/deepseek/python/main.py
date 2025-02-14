from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Flask! Hello Celine, good job.222!"

if __name__ == "__main__":
    app.run()
