class Character {
  final String id;
  final String name;
  final String imageUrl;
  final String description;
  final String nationality;
  final String era;

  Character({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.description,
    required this.nationality,
    required this.era,
  });
}

class Mood {
  final String id;
  final String name;
  final String emoji;
  final String description;

  Mood({
    required this.id,
    required this.name,
    required this.emoji,
    required this.description,
  });
} 