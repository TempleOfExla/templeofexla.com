---
layout: layouts/base.njk
title: Tags
permalink: /tags/index.html
---

# All Tags
<ul>
  {% for tag in collections.all | getAllTags %}
    <li>
      <a href="/tags/{{ tag | slug }}/">{{ tag }}</a>
      ({{ collections[tag].length }} posts)
    </li>
  {% endfor %}
</ul>
