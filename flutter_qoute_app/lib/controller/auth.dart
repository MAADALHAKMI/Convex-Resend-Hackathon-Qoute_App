import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> registerUser({
  required String firstName,
  required String lastName,
  required String email,
  required String password,
  required String favoriteCharacterId,
}) async {
  final url = Uri.parse(
    'https://fearless-fly-71.convex.cloud/api/mutation',
  );

  final body = {
    'path': 'mutations/users:register', // اسم الملف 'users' والتابع 'register'
    'args': {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'favoriteCharacter': favoriteCharacterId,
    },
    'format': 'json', // لتأكيد نوع الاستجابة
  };

  try {
    print("📤 Sending registration request to: $url");
    print("📦 Request body: ${jsonEncode(body)}");

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    print("📥 Response status: ${response.statusCode}");
    print("📥 Response body: ${response.body}");
    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);

      if (jsonResponse['status'] == 'error') {
        final errorMessage = jsonResponse['errorMessage'] ?? 'Unknown error';
        print('Registration failed: $errorMessage');
        return false; // أو تقدر ترجع خطأ خاص عشان تظهره UI
      } else {
        // نجاح حقيقي
        return true;
      }
    } else {
      // أي كود آخر يعني فشل في الطلب نفسه
      return false;
    }
  } catch (e) {
    print("💥 Exception occurred: $e");
    return false; // أو تقدر ترجع خطأ خاص عشان تظهره UI
  }
}

//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////loginFuture<bool> loginUser({

Future<bool> loginUser({
  required String email,
  required String password,
}) async {
  final url = Uri.parse(
    'https://fearless-fly-71.convex.cloud/api/mutation',
  );

  final body = {
    'path': 'mutations/users:login', // اسم الملف 'users' واسم الدالة 'login'
    'args': {
      'email': email,
      'password': password,
    },
    'format': 'json',
  };

  try {
    print("📤 Sending login request to: $url");
    print("📦 Request body: ${jsonEncode(body)}");

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    print("📥 Response status: ${response.statusCode}");
    print("📥 Response body: ${response.body}");

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);

      if (jsonResponse['status'] == 'error') {
        final errorMessage = jsonResponse['errorMessage'] ?? 'Unknown error';
        print('Login failed: $errorMessage');
        return false;
      } else {
        final userData = jsonResponse['value'];
        print("✅ Login successful for user: ${userData['email']}");

        // تخزين userId و email في SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userId', userData['id']);
        await prefs.setString('userEmail', userData['email']);

        return true;
      }
    } else {
      return false;
    }
  } catch (e) {
    print("💥 Exception occurred during login: $e");
    return false;
  }
}
