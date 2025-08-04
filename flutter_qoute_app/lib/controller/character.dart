import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> fetchCharacters() async {
  final url = Uri.parse(
    'https://fearless-fly-71.convex.cloud/api/query',
  );

  final body = {
    'path': 'characters:list', // اسم الدالة في Convex
    'args': {},
    'format': 'json', // يفضل إضافتها
  };

  try {
    print('📤 Sending request to: $url');
    print('📦 Request body: ${jsonEncode(body)}');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    print('📥 Status Code: ${response.statusCode}');
    print('📥 Response Body: ${response.body}');

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);

      // التحقق من وجود المفتاح "value" في الرد
      if (decoded is Map && decoded.containsKey('value')) {
        print('✅ Characters fetched successfully.');
        return decoded['value'] as List<dynamic>;
      } else {
        print('⚠️ Unexpected response format: $decoded');
        throw Exception('Unexpected response format');
      }
    } else {
      print('❌ Failed to fetch characters. Status: ${response.statusCode}');
      throw Exception('HTTP ${response.statusCode}');
    }
  } catch (e) {
    print('💥 Exception occurred: $e');
    throw Exception('Error fetching characters: $e');
  }
}
