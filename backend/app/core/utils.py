from datetime import datetime
from typing import Optional


def calculate_percentage_change(current: float, previous: float) -> float:
    """Calcular porcentagem de mudança."""
    if previous == 0:
        return 0.0
    return ((current - previous) / previous) * 100


def format_currency(value: float) -> str:
    """Formatar valor como moeda."""
    return f"R$ {value:,.2f}"


def get_month_name(month: int) -> str:
    """Obter nome do mês em português."""
    months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return months[month - 1] if 1 <= month <= 12 else ""


def parse_date(date_str: str) -> Optional[datetime]:
    """Parse string de data para datetime."""
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None
