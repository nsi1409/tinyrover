import cv2

index = 0
arr = []
for i in range(10):
	cap = cv2.VideoCapture(index)
	if not cap.read()[0]:
		break
	else:
		arr.append(index)
	cap.release()
	index += 1
print(arr)
