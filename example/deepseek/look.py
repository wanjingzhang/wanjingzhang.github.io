import psutil
import os
import ctypes
from collections import defaultdict

#  python look.py > result.txt
# 一些典型的监控软件进程名
MONITORING_PROCESSES = [
    "cb.exe", "carbonblack.exe", "cbsensor.exe",
    "trendy.exe", "tmccsf.exe", "coreServiceShell.exe",
    "csfalcon.exe", "sentinelagent.exe", "crowdstrike.exe",
    "winlogon.exe", "smss.exe"  # 可被滥用为监控外壳
]

# 可疑API调用关键词（仅检测命名，无法监控调用链）
SUSPICIOUS_KEYWORDS = [
    "key", "screenshot", "inject", "spy", "remote", "hook", "capture"
]

# 检测是否是管理员权限
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

# 主函数
def detect_suspicious_processes():
    print("正在检测系统中的可疑行为监控进程...\n")
    suspicious = []
    by_name = defaultdict(list)

    for proc in psutil.process_iter(['pid', 'name', 'exe', 'username', 'cmdline']):
        try:
            pname = proc.info['name'].lower()
            cmd = ' '.join(proc.info['cmdline']).lower() if proc.info['cmdline'] else ''
            
            # 可疑进程名或命令行中包含敏感关键词
            if any(m in pname for m in MONITORING_PROCESSES) or any(k in cmd for k in SUSPICIOUS_KEYWORDS):
                suspicious.append(proc.info)
                by_name[pname].append(proc.info['pid'])

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    if suspicious:
        print(f"发现 {len(suspicious)} 个潜在监控进程：\n")
        for proc in suspicious:
            print(f"[PID {proc['pid']}] {proc['name']} - 来自用户：{proc['username']}")
            print(f"命令行：{proc['cmdline']}\n")
    else:
        print("未发现已知的监控进程。")

    return suspicious

if __name__ == "__main__":
    if not is_admin():
        print("请以管理员身份运行此脚本（右键 → 以管理员身份运行）以获得完整信息。\n")
    detect_suspicious_processes()
    print(" 检测完成。请根据需要采取相应措施。")