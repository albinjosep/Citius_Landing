import requests
import sys
from datetime import datetime
import json

class CitiusAPITester:
    def __init__(self, base_url="https://prospect-ai-launch.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Response: {json.dumps(result['response_data'], indent=2)}")
                except:
                    result["response_data"] = response.text
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result["error"] = error_data
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    result["error"] = response.text
                    print(f"   Error: {response.text}")

            self.test_results.append(result)
            return success, result.get("response_data", {})

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_waitlist_count(self):
        """Test getting waitlist count"""
        return self.run_test("Get Waitlist Count", "GET", "waitlist/count", 200)

    def test_join_waitlist_valid_email(self, email):
        """Test joining waitlist with valid email"""
        return self.run_test(
            f"Join Waitlist - Valid Email ({email})",
            "POST",
            "waitlist",
            200,
            data={"email": email}
        )

    def test_join_waitlist_duplicate_email(self, email):
        """Test joining waitlist with duplicate email"""
        return self.run_test(
            f"Join Waitlist - Duplicate Email ({email})",
            "POST",
            "waitlist",
            409,
            data={"email": email}
        )

    def test_join_waitlist_invalid_email(self, email):
        """Test joining waitlist with invalid email"""
        return self.run_test(
            f"Join Waitlist - Invalid Email ({email})",
            "POST",
            "waitlist",
            400,
            data={"email": email}
        )

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 TEST SUMMARY")
        print(f"="*60)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed < self.tests_run:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   - {result['test_name']}: {result.get('error', 'Status code mismatch')}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Citius API Testing...")
    print("="*60)
    
    tester = CitiusAPITester()
    
    # Generate unique test email
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    test_email = f"test_user_{timestamp}@example.com"
    
    # Test sequence
    print(f"Using test email: {test_email}")
    
    # 1. Test root endpoint
    tester.test_root_endpoint()
    
    # 2. Test waitlist count (should work regardless)
    tester.test_waitlist_count()
    
    # 3. Test joining waitlist with valid email
    success, response = tester.test_join_waitlist_valid_email(test_email)
    
    # 4. Test duplicate email (should return 409)
    if success:
        tester.test_join_waitlist_duplicate_email(test_email)
    
    # 5. Test invalid email formats
    tester.test_join_waitlist_invalid_email("invalid-email")
    tester.test_join_waitlist_invalid_email("")
    tester.test_join_waitlist_invalid_email("   ")
    
    # Print results
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())