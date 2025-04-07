# General Algorithm Visualizer

## General Demo
(This video was taken before starting data structure visualization seen in the below videos) \
[![General Demo Video](https://img.youtube.com/vi/Q-R_5Pt8iCM/0.jpg)](https://youtu.be/Q-R_5Pt8iCM "General Algorithm Visualizer General Demo")

## Array Visualization
(Note that the colored regions in the visualization section are for debugging purposes) \
[![Map Visualization Video](https://img.youtube.com/vi/8A7TeqgJccQ/0.jpg)](https://youtu.be/8A7TeqgJccQ "General Algorithm Visualizer Map Visualization")

## Queue & Set Visualization
[![Map Visualization Video](https://img.youtube.com/vi/na4Z-v7j40o/0.jpg)](https://youtu.be/na4Z-v7j40o "General Algorithm Visualizer Map Visualization")

## Map Visualization
[![Map Visualization Video](https://img.youtube.com/vi/HeRnCdYRwbw/0.jpg)](https://youtu.be/HeRnCdYRwbw "General Algorithm Visualizer Map Visualization")

## AI-Assisted Type Classification
[![AI-Assisted Type Classification Video](https://img.youtube.com/vi/zf1jaYEeFY8/0.jpg)](https://youtu.be/zf1jaYEeFY8 "General Algorithm Visualizer AI-Assisted Type Classification")

## About

General Algorithm Visualizer (GAV) was an undergraduate research project I worked on for two quarters.

Currently, there are other options for visualizing algorithms. However, we believe that there are downsides to those services. 
- [Python Tutor](https://pythontutor.com/) is robust (e.g. uses arrows for every reference, represents all programmatically-equivalent data structures the same way). This has its use cases, e.g. for more thoroughly understanding how the variables and call stack frames refer to each other. However, we believe that this is achieved at the compromise of intuition.
  - Arrays, stacks, and heaps are the same programmatically (e.g. `arr = [1, 2, 3]; stack = [1, 2, 3]; heap = [1, 2, 3]; heapq.heapify(heap)`), but you may want to visualize them differently for better understanding
- On the other side of the spectrum, [Algorithm Visualizer](https://algorithm-visualizer.org/) has intuitive representations, but the downside is that you have to manually handle the visualization logic, which can be inconvenient and not beginner-friendly.

We believe that there could be a middle ground that contains both intuitive representations and ease-of-use. That is what we're trying to achieve with GAV.

For now, development has paused with GAV. I believe that it already contains a great amount of utility, but there's also a lot of other features to implement. If I decide to in the future (e.g. there's a demand for it, I am re-inspired), I can resume development.
