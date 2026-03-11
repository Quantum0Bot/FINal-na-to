@echo off
for /l %%r in (1,1,33) do (
    for %%s in (a b c) do (
        curl -o images\r%%r%%s.jpg https://picsum.photos/seed/r%%r%%s/600/400
    )
)
