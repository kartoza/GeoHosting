import re


def parse_k8s_size(size_str):
    """Convert Kubernetes size strings to bytes."""
    if not size_str:
        return 0
    size_str = size_str.strip()
    match = re.match(r"^(\d+(?:\.\d+)?)([KMGTP]i)$", size_str)
    if not match:
        return 0
    value, unit = match.groups()
    value = float(value)
    factor_map = {
        "Ki": 1024,
        "Mi": 1024 ** 2,
        "Gi": 1024 ** 3,
        "Ti": 1024 ** 4,
        "Pi": 1024 ** 5,
    }
    return int(value * factor_map.get(unit, 0))


def parse_k8s_cpu(cpu_str):
    """Convert Kubernetes CPU string (like '500m' or '1') to float cores.    """
    if not cpu_str:
        return 0.0
    cpu_str = cpu_str.strip()
    if cpu_str.endswith('m'):
        return float(cpu_str[:-1]) / 1000.0
    return float(cpu_str)


def format_bytes(size):
    """Format bytes to human readable format."""
    power = 1024
    units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    i = 0
    while size >= power and i < len(units) - 1:
        size /= power
        i += 1
    if size.is_integer():
        return f"{int(size)} {units[i]}"
    else:
        return f"{size:.2f} {units[i]}"
