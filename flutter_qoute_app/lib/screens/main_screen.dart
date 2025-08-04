import 'package:flutter/material.dart';
import '../controller/email.dart';
import '../controller/emailLoges.dart';
import 'mood_selection_screen.dart';
import '../theme/app_theme.dart';

class SendQuoteEmailScreen extends StatefulWidget {
  const SendQuoteEmailScreen({Key? key}) : super(key: key);

  @override
  State<SendQuoteEmailScreen> createState() => _SendQuoteEmailScreenState();
}

class _SendQuoteEmailScreenState extends State<SendQuoteEmailScreen> {
  bool isLoading = false;
  bool isDailyEmailEnabled = false; // هل زر التفعيل معطل أم لا
  int? countAll;
  int? countRead;
  int? countUnread;
  int? countDaily;
  int? countMood;
  String? errorMessage;

  final EmailService _emailService = EmailService();

  @override
  void initState() {
    super.initState();
    _loadCounts();
  }

  Future<void> _handleSendEmail() async {
    setState(() => isLoading = true);
    try {
      final success = await _emailService.sendQuoteEmail();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            success
                ? '✅ Dailily qoute Email has been enabled!'
                : '❌ فشل في إرسال الإيميل',
          ),
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _loadCounts() async {
    setState(() {
      errorMessage = null;
    });

    try {
      final allEmails = await testCountByUser();
      final readEmails = await countByUserStatusDelivered();
      final sentEmails = await countByUserStatusSent();
      final dailyEmails = await countByUserTypeDaily();
      final moodEmails = await countByUserTypeMood();

      setState(() {
        countAll = allEmails;
        countRead = readEmails;
        countUnread =
            (sentEmails - readEmails) < 0 ? 0 : (sentEmails - readEmails);
        countDaily = dailyEmails;
        countMood = moodEmails;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    }
  }

  Future<void> _handleEnableDailyEmails() async {
    setState(() {
      isLoading = true;
      isDailyEmailEnabled = true;
    });

    try {
      await Future.delayed(const Duration(seconds: 1));
      Future.delayed(const Duration(minutes: 5), () {
        if (mounted) {
          setState(() {
            isDailyEmailEnabled = false;
          });
        }
      });
    } catch (e) {
      debugPrint("Error enabling daily emails: $e");
      setState(() {
        isDailyEmailEnabled = false;
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Widget _buildStatCard(String title, int? value, TextStyle? style) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: AppTheme.surfaceColor,
      shadowColor: AppTheme.primaryColor.withOpacity(0.1),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding:
            const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(child: Text(title, style: style)),
            Text(
              '${value ?? 0}',
              style: style?.copyWith(
                color: AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
                fontSize:
                    style?.fontSize != null ? style!.fontSize! + 2 : 18,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    Widget content;
    if (isLoading && countAll == null) {
      content = const Center(child: CircularProgressIndicator());
    } else if (errorMessage != null) {
      content = Text(
        '❌ An error occurred: $errorMessage',
        style: textTheme.bodyLarge?.copyWith(color: Colors.red),
      );
    } else {
      content = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildStatCard("📥 All emails sent from our app", countAll,
              textTheme.titleLarge),
          _buildStatCard("📬 Emails you’ve read", countRead,
              textTheme.titleLarge),
          _buildStatCard("📪 Emails sent to you but not read", countUnread,
              textTheme.titleLarge),
          _buildStatCard("🗓️ Daily emails you’ve received", countDaily,
              textTheme.titleLarge),
          _buildStatCard("🎭 Emails from characters based on your mood",
              countMood, textTheme.titleLarge),
        ],
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('🏠 Home'),
        backgroundColor: AppTheme.surfaceColor,
        elevation: 2,
      ),
      body: RefreshIndicator(
        onRefresh: _loadCounts,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              Text('📊 User Email Statistics',
                  style: textTheme.headlineMedium),
              const SizedBox(height: 16),
              content,
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: (isLoading || isDailyEmailEnabled)
                    ? null
                    : _handleSendEmail,
                icon: const Icon(Icons.notifications_active),
                label: const Text('Enable Daily Emails'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  backgroundColor: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MoodSelectionScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.mood),
                label: const Text(
                    'Send your mood to an inspiring character'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  foregroundColor: AppTheme.primaryColor,
                  side: const BorderSide(
                      color: AppTheme.primaryColor, width: 2),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
