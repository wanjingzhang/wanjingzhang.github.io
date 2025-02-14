> pip install Flask

#### 安装Flask

> python -m flask --app app run

#### 在python中 运行flask 启动整个项目

> python -m flask run // X 运行的命令不对，没有指定文件

#### 之前失败是因为文件命名为main.py 而不是app.py导致运行时找不到默认的文件

> python -m flask --app app run --port 5001

#### 使用 port切换端口 5001, port 要放在run后面，要不然不好运行

> python -m flask run --host=0.0.0.0

#### 启动外网访问 Running on <http://128.3.10.192:5000>
