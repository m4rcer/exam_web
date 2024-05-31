<!DOCTYPE html>
<html>
<head>
    <title>{{ $article->title }}</title>

    <style>
        * {
            font-family: DejaVu Sans;
        }
    </style>
</head>
<body>
<h1>{{ $article->title }}</h1>
<p><strong>Type:</strong> {{ $article->type }}</p>
<p><strong>Description:</strong> {{ $article->description }}</p>
<p><strong>Rating:</strong> {{ $article->rating }}</p>
<p><strong>Views:</strong> {{ $article->views }}</p>
<p><strong>Author:</strong> {{ $article->author }}</p>
<p><strong>Date:</strong> {{ $article->date }}</p>
</body>
</html>
