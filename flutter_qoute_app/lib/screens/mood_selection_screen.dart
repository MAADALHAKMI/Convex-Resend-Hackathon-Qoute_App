import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../controller/email.dart';
import '../data/app_data.dart';
import '../theme/app_theme.dart';

class MoodSelectionScreen extends StatefulWidget {
  const MoodSelectionScreen({super.key});

  @override
  State<MoodSelectionScreen> createState() => _MoodSelectionScreenState();
}

class _MoodSelectionScreenState extends State<MoodSelectionScreen> {
  String? selectedMood;
  String? selectedCharacter;
  bool canSend = true;
  String timeLeftText = "";
  final EmailService _emailService = EmailService();
  Timer? cooldownTimer;

  @override
  void initState() {
    super.initState();
    _checkCooldown();
    cooldownTimer = Timer.periodic(const Duration(minutes: 1), (timer) {
      _checkCooldown();
    });
  }

  @override
  void dispose() {
    cooldownTimer?.cancel();
    super.dispose();
  }

  Future<void> _checkCooldown() async {
    final prefs = await SharedPreferences.getInstance();
    final lastSent = prefs.getInt('lastMoodSentTime');
    final now = DateTime.now().millisecondsSinceEpoch;
    const cooldown = 24 * 60 * 60 * 1000;

    if (lastSent != null && now - lastSent < cooldown) {
      final remainingMs = cooldown - (now - lastSent);
      final remainingHours = (remainingMs ~/ (1000 * 60 * 60));
      final remainingMinutes = ((remainingMs % (1000 * 60 * 60)) ~/ (1000 * 60));

      setState(() {
        canSend = false;
        timeLeftText = remainingHours > 0
            ? "Please try again in ${remainingHours}h ${remainingMinutes}m"
            : "Please try again in ${remainingMinutes}m";
      });
    } else {
      setState(() {
        canSend = true;
        timeLeftText = "";
      });
    }
  }

  void _sendQuote() async {
    if (!canSend) {
      _showSnack("⏳ You have reached your daily limit. $timeLeftText.", AppTheme.errorColor);
      return;
    }

    if (selectedMood != null && selectedCharacter != null) {
      final success = await _emailService.sendMoodQuote(selectedMood!, selectedCharacter!);
      final name = AppData.characters.firstWhere((c) => c["id"] == selectedCharacter)["name"];

      _showSnack(
        success
            ? '✅ Your mood was sent to $name!'
            : '❌ Failed to send mood, please try again.',
        success ? AppTheme.successColor : AppTheme.errorColor,
      );

      if (success) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('lastMoodSentTime', DateTime.now().millisecondsSinceEpoch);
        setState(() {
          selectedMood = null;
          selectedCharacter = null;
          canSend = false;
        });
      }
    } else {
      final msg = selectedMood == null && selectedCharacter == null
          ? 'Please select your mood and character'
          : selectedMood == null
              ? 'Please select your mood'
              : 'Please select your character';
      _showSnack(msg, AppTheme.errorColor);
    }
  }

  void _showSnack(String msg, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Widget _buildMoodCard(Map mood) {
    final isSelected = selectedMood == mood["value"];
    return GestureDetector(
      onTap: () => setState(() => selectedMood = mood["value"]),
      child: Card(
        color: isSelected ? AppTheme.primaryColor.withOpacity(0.1) : AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(
            color: isSelected ? AppTheme.primaryColor : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(mood["emoji"]!, style: const TextStyle(fontSize: 28)),
            const SizedBox(height: 8),
            Text(mood["value"]!, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }

  Widget _buildCharacterCard(Map char) {
    final isSelected = selectedCharacter == char["id"];
    return GestureDetector(
      onTap: () => setState(() => selectedCharacter = char["id"]),
      child: Card(
        color: isSelected ? AppTheme.accentColor.withOpacity(0.1) : AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: BorderSide(
            color: isSelected ? AppTheme.accentColor : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(char["image"]!, height: 56, width: 56, fit: BoxFit.cover),
            const SizedBox(height: 8),
            Text(char["name"]!, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text("Send your mood to someone inspiring"),
        backgroundColor: AppTheme.surfaceColor,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text("How are you feeling today?", style: textTheme.headlineSmall),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: AppData.moods.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10,
              ),
              itemBuilder: (ctx, i) => _buildMoodCard(AppData.moods[i]),
            ),
            const SizedBox(height: 24),
            Text("Choose your favorite character:", style: textTheme.headlineSmall),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: AppData.characters.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10,
              ),
              itemBuilder: (ctx, i) => _buildCharacterCard(AppData.characters[i]),
            ),
            const SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: _sendQuote,
              icon: const Icon(Icons.send),
              label: Text(canSend ? "Send Mood" : "Daily Limit Reached"),
              style: ElevatedButton.styleFrom(
                backgroundColor: canSend ? AppTheme.primaryColor : AppTheme.errorColor,
                padding: const EdgeInsets.symmetric(vertical: 16),
                minimumSize: const Size(double.infinity, 52),
              ),
            ),
            if (!canSend && timeLeftText.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 12.0),
                child: Text(
                  timeLeftText,
                  style: textTheme.bodyMedium?.copyWith(color: AppTheme.errorColor),
                  textAlign: TextAlign.center,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
