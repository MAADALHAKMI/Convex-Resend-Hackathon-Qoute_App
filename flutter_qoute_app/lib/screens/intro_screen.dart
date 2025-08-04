import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'main_screen.dart';

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<IntroPage> _pages = [
    IntroPage(
      title: 'Welcome to the Quotes App',
      description: 'Discover the wisdom of the greats through inspiring quotes from the most famous writers and philosophers in history',
      icon: Icons.auto_stories,
      color: AppTheme.primaryColor,
    ),
    IntroPage(
      title: 'Choose Your Mood',
      description: 'Tell us how you feel today and we will select the perfect quote for your mood',
      icon: Icons.psychology,
      color: AppTheme.accentColor,
    ),
    IntroPage(
      title: 'Get Daily Messages',
      description: 'We will send you inspiring quotes daily via email to boost your mood',
      icon: Icons.email,
      color: AppTheme.secondaryColor,
    ),
    IntroPage(
      title: 'Explore Great Characters',
      description: 'Learn about the wisdom of Dostoevsky, Nietzsche, Camus, Tolstoy, and Dickens',
      icon: Icons.people,
      color: AppTheme.successColor,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _startApp();
    }
  }

  void _startApp() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const SendQuoteEmailScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Skip Button
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: TextButton(
                  onPressed: _startApp,
                  child: const Text('Skip'),
                ),
              ),
            ),
            
            // Page View
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final page = _pages[index];
                  return Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Icon
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: page.color.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(60),
                          ),
                          child: Icon(
                            page.icon,
                            size: 60,
                            color: page.color,
                          ),
                        ),
                        
                        const SizedBox(height: 48),
                        
                        // Title
                        Text(
                          page.title,
                          style: Theme.of(context).textTheme.displaySmall,
                          textAlign: TextAlign.center,
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // Description
                        Text(
                          page.description,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: AppTheme.textSecondaryColor,
                            height: 1.6,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            
            // Bottom Section
            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                children: [
                  // Page Indicators
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _pages.length,
                      (index) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _currentPage == index ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _currentPage == index 
                            ? AppTheme.primaryColor 
                            : AppTheme.textSecondaryColor.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Next/Start Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _nextPage,
                      child: Text(
                        _currentPage == _pages.length - 1 ? 'Start Now' : 'Next',
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Back Button
                  if (_currentPage > 0)
                    TextButton(
                      onPressed: () {
                        _pageController.previousPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      child: const Text('Back'),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class IntroPage {
  final String title;
  final String description;
  final IconData icon;
  final Color color;

  IntroPage({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });
}
