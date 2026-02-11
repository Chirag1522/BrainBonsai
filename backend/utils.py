def apply_growth(current_maturity: int, growth: int) -> int:
    """
    Safely increase maturity without exceeding 100
    """
    return min(100, current_maturity + growth)
