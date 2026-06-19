from detect import classify

def test_safe():
    assert classify(0) == "SAFE"
    assert classify(10) == "SAFE"

def test_warning():
    assert classify(11) == "WARNING"
    assert classify(20) == "WARNING"

def test_critical():
    assert classify(21) == "CRITICAL"
    assert classify(100) == "CRITICAL"

if __name__ == "__main__":
    test_safe()
    test_warning()
    test_critical()
    print("All tests passed.")
