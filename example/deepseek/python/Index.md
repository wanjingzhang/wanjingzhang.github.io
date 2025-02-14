> 查找 Python:

```
    C:\Users\CelineZ>where Python
    C:\Users\CelineZ\AppData\Local\Microsoft\WindowsApps\python.exe
```

> 查看 Python 版本
`python -v`

> 进入 Python, >>> 进入交互模式
`python`

> 退出 Python
`quit()`

> 计算

```
>>> 2+2
>>> 4
```

> 访问未定义变量

```
>>> n
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'n' is not defined
```

> 字符串 转义符 \':', \n:换行, 混合运算，定义变量, 变量运算, 下标负数 从右边计算, 切片[0:2], 越界[10],

```
>>> 'don\'t' 
"don't"
>>> print('C:\some\name')  
C:\some
ame
>>> 3*'un'+'ium'
'unununium'
>>> prefix = 'Py'
>>> prefix
'Py'
>>> prefix = prefix + 'thon'
>>> prefix
Python
>>> prefix[0]
'P'
>>> prefix[-2]
'o'
>>> prefix[0:2]
>>> prefix[10]
'Py'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
IndexError: string index out of range
>>>
```

> 平方

```
>>> 5 ** 2
25
>>> width = 20
>>> height = 5 * 9
>>> width * height
900
>>> 4 * 3.75 - 1
14.0
>>> 14.0

```

> flask 框架

```
最小最快捷扩展性更佳的 web 应用框架
```
