---
tags: [system-design, concurrency, theory]
title: "Workload characteristics"
---
# I/O bound vs Memory bound vs Network bound

| Task | Definition | Fit to concurrency model |
| --- | --- | --- |
| I/O bound | Tasks or transactions are those that are primarily limited by input/output operations, such as reading or writing data to storage devices or communicating with external systems (network, etc). | Thread |
| CPU bound | Tasks or transactions are those that are primarily limited by the processing power of the central processing unit (CPU). | Processes or if data sharing is not a problem, threads |
| Memory bound | Tasks or transactions are those that are primarily limited by the speed of the system’s memory (RAM). | Threads, however, if there are concerns about data integrity and isolation, processes might be preferred |
