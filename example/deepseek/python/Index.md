> 安装 Python
`C:\Users\CelineZ\AppData\Local\Programs\Python`

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

> 连续行
`>>> if the_world_is_flat:
...     print("Be careful not to fall off!")
...
Be careful not to fall off!`

> 计算

```
>>> 2+2
>>> 4
>>> 5 ** 2 # 5 squared
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

> 循环

```
>>> a,b = 0,1
>>> while a < 10:
...     print('The value a is:',a)
...     a,b = b, a+b

>>> x = int (input("Please enter an integer:")) 
Please enter an integer:42
>>> if x <0:
...     x = 0
...     print('Negative changed to zero')
... elif x == 0:
...     print('Zero')
... elif x == 1: 
...     print('Single')
... else:     
...     print('More') 
... 
More
 
>>> words = ['cat','window','defenstrate']
>>> for w in words:
...     print(w,len(w)) 

>>> users = {'Hans': 'active', 'Éléonore': 'inactive', '景太郎': 'active'}
>>> for user, status in users.copy().items():
...     if status=='inactive':
...             del users[user] 
>>> users
{'Hans': 'active', '景太郎': 'active'}
>>>
>>> active_users = {}
>>> for user, status in users.items():  
...     if status == 'active':
...             active_users[user] = status
... 
>>> 
>>> active_users
{'Hans': 'active', '景太郎': 'active'}

>>> for i in range(5):  # 等差数列
...     print(i)

>>> sum(range(4)) # 0+1+2+3
```
