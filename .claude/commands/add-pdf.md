---
description: Add a book's PDF (facts source, page-accurate bookmark, originality check)
argument-hint: "<book-slug> <path to pdf>"
---
Add the book PDF: $ARGUMENTS
1. Run `python tools/book.py ingest <book-slug> "<path>"`. If it warns about a scanned PDF (no text), tell the user it needs OCR first (e.g. `ocrmypdf`) and stop.
2. Show the user the chapter headings it found, in 10 lines or fewer.
3. **Align with what's already made:** for every entry in `library/<book>/bookmark.json` → `history` (and the episodes' `notes.md`), use `python tools/book.py find` and `pages` to locate the pages that episode covered. Fill in their `pages`, then set `covered_to_page` / `next_start_page` with `python tools/book.py advance …` for the latest episode.
4. Update `series/books/<book>.md`: add a **Pages** column to the plan (approximate ranges for future parts, using chapter breaks), and check each future part's summary against the text. Fix anything the old plan got wrong.
5. Reply: pages covered so far, where the next episode will start (page + event), and any plan corrections.
