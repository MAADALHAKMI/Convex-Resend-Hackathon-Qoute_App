import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class EmailService {
  static const String _convexUrl =
      'https://fearless-fly-71.convex.cloud/api/mutation';

  Future<bool> sendQuoteEmail() async {
    try {
      // قراءة userId من SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      print("📌 قراءة userId من SharedPreferences: $userId");

      if (userId == null || userId.isEmpty) {
        print("❌ لم يتم العثور على userId أو أنه فارغ");
        return false;
      }

      // تجهيز البيانات المرسلة
      final bodyData = {
        'path':
            'mutations/users:sendQuoteEmailPublic', // أو "users:sendQuoteEmail" حسب مسارك في Convex
        'args': {'userId': userId}
      };

      print("📌 إرسال طلب إلى Convex");
      print("🔗 URL: $_convexUrl");
      print("📦 Body: ${jsonEncode(bodyData)}");

      // إرسال الطلب
      final response = await http.post(
        Uri.parse(_convexUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(bodyData),
      );

      print("📥 Status Code: ${response.statusCode}");
      print("📥 Response Body: ${response.body}");

      // فحص إذا السيرفر رجع خطأ
      if (response.statusCode == 200) {
        final resJson = jsonDecode(response.body);

        if (resJson is Map && resJson.containsKey('error')) {
          print("⚠️ خطأ من Convex: ${resJson['error']}");
          return false;
        }

        print("✅ الإيميل أُرسل بنجاح");
        return true;
      } else {
        print("❌ فشل الإرسال - الكود: ${response.statusCode}");
        return false;
      }
    } catch (e, stack) {
      print("💥 خطأ أثناء الإرسال: $e");
      print("📜 Stack Trace: $stack");
      return false;
    }
  }

////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  Future<bool> sendMoodQuote(String mood, String characterId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      print("📌 قراءة userId من SharedPreferences: $userId");

      if (userId == null || userId.isEmpty) {
        print("❌ لم يتم العثور على userId");
        return false;
      }

      final bodyData = {
        'path': 'mutations/users:sendMoodBasedQuotePublic', // اسم الميوتشن في Convex
        'args': {'userId': userId, 'characterId': characterId, 'mood': mood}
      };

      print("📦 Body: ${jsonEncode(bodyData)}");

      final response = await http.post(
        Uri.parse(_convexUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(bodyData),
      );

      print("📥 Status Code: ${response.statusCode}");
      print("📥 Response Body: ${response.body}");

      if (response.statusCode == 200) {
        final resJson = jsonDecode(response.body);
        if (resJson is Map && resJson.containsKey('error')) {
          print("⚠️ خطأ من Convex: ${resJson['error']}");
          return false;
        }
        print("✅ تم الإرسال بنجاح");
        return true;
      } else {
        print("❌ فشل الإرسال - الكود: ${response.statusCode}");
        return false;
      }
    } catch (e, stack) {
      print("💥 خطأ أثناء الإرسال: $e");
      print("📜 Stack Trace: $stack");
      return false;
    }
  }
}
