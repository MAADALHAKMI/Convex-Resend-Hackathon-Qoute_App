import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


Future<int> fetchCountByUserGeneric({
  required String functionPath,
}) async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');

  final body = {
    'path': functionPath,
    'args': {'userId': userId},  // 👈 أرسل ككائن (object) وليس قائمة
    'format': 'json',
  };

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      return (decoded['value'] as num).toInt();  // 👈 تحويل آمن من num إلى int
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}
Future<int> testCountByUser() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  print('📌 userId from SharedPreferences: $userId');

  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');
  final body = {
    'path': 'mutations/emailLogs:countByUser',
    'args': {"userId": userId},
    'format': 'json',
  };

  print('🌐 Sending request to: $url');
  print('📦 Request body: ${jsonEncode(body)}');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  print('📥 Status code: ${response.statusCode}');
  print('📥 Response body: ${response.body}');

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      final count = (decoded['value'] as num).toInt(); // ✅ التحويل الصحيح
      print('✅ Count from server: $count');
      return count;
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}





Future<int> countByUserStatusSent() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  print('📌 userId from SharedPreferences: $userId');

  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');
  final body = {
    'path': 'mutations/emailLogs:countByUserAndStatusSent',
    'args': {'userId': userId},
    'format': 'json',
  };

  print('🌐 Sending request to: $url');
  print('📦 Request body: ${jsonEncode(body)}');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  print('📥 Status code: ${response.statusCode}');
  print('📥 Response body: ${response.body}');

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      final count = (decoded['value'] as num).toInt();
      print('✅ Count from server: $count');
      return count;
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}

// دالة لجلب عدد الإيميلات من نوع "mood" لليوزر
Future<int> countByUserTypeMood() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  print('📌 userId from SharedPreferences: $userId');

  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');
  final body = {
    'path': 'mutations/emailLogs:countByUserAndTypeMood',
    'args': {'userId': userId},
    'format': 'json',
  };

  print('🌐 Sending request to: $url');
  print('📦 Request body: ${jsonEncode(body)}');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  print('📥 Status code: ${response.statusCode}');
  print('📥 Response body: ${response.body}');

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      final count = (decoded['value'] as num).toInt();
      print('✅ Count from server: $count');
      return count;
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}

// دالة لجلب عدد الإيميلات من نوع "daily" لليوزر
Future<int> countByUserTypeDaily() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  print('📌 userId from SharedPreferences: $userId');

  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');
  final body = {
    'path': 'mutations/emailLogs:countByUserAndTypeDaily',
    'args': {'userId': userId},
    'format': 'json',
  };

  print('🌐 Sending request to: $url');
  print('📦 Request body: ${jsonEncode(body)}');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  print('📥 Status code: ${response.statusCode}');
  print('📥 Response body: ${response.body}');

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      final count = (decoded['value'] as num).toInt();
      print('✅ Count from server: $count');
      return count;
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}
Future<int> countByUserStatusDelivered() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId');
  print('📌 userId from SharedPreferences: $userId');

  if (userId == null) {
    throw Exception('User ID not found in SharedPreferences');
  }

  final url = Uri.parse('https://fearless-fly-71.convex.cloud/api/query');
  final body = {
    'path': 'mutations/emailLogs:countByUserAndStatusDelivered',
    'args': {'userId': userId},
    'format': 'json',
  };

  print('🌐 Sending request to: $url');
  print('📦 Request body: ${jsonEncode(body)}');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  print('📥 Status code: ${response.statusCode}');
  print('📥 Response body: ${response.body}');

  if (response.statusCode == 200) {
    final decoded = jsonDecode(response.body);
    if (decoded is Map && decoded.containsKey('value')) {
      final count = (decoded['value'] as num).toInt();
      print('✅ Count from server: $count');
      return count;
    } else {
      throw Exception('Unexpected response format: $decoded');
    }
  } else {
    throw Exception('HTTP ${response.statusCode}');
  }
}


// دالة لجلب عدد الإيميلات لليوزر و characterId معين (بغض النظر عن النوع)
