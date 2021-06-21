import cv2
import numpy as np
from keras.models import Sequential 
from keras.layers import MaxPooling2D, AveragePooling2D

def processImage(image):
    image = cv2.imread(image)
    image = cv2.cvtColor(src=image, code=cv2.COLOR_BGR2GRAY)
    return image

def poolingImage(filenameList,poolingOption):
    for filename in filenameList:
        # Grayscale Image
        image = processImage('./pool_input/'+filename+'.png')
        cv2.imwrite('./pool_input/'+filename+'_gray.jpg', image)

        if(poolingOption=="avg"):
            image = image.astype(np.float32)

        #print("before reshaping")
        #print(image)

        rows = len(image)
        columns = len(image[0])
        #print("row "+str(rows))
        #print("columns "+str(columns))

        #reshaping
        arr = image.reshape(1, rows, columns, 1) 
        
        #print("after reshaping")
        #print(arr)

        #define a max pooling layer
        if(poolingOption =='max'):
            pool_option = MaxPooling2D(pool_size = 10, strides = 10)

            model = Sequential( 
                [pool_option]) 
        
            #get the output 
            output = model.predict(arr) 
            
            #print the output  
            output = np.squeeze(output) 
            print(output) 

            cv2.imwrite('./pool_output/'+poolingOption+'/'+filename+'_out.jpg', output)
        elif(poolingOption =='avg'):
            pool_option = AveragePooling2D(pool_size=(10, 10),strides=(10, 10), padding='valid')

            #define a sequential model with just one pooling layer
            model = Sequential( 
                [pool_option]) 
            
            #get the output 
            output = model.predict(arr) 
            
            #print the output  
            output = np.squeeze(output) 
            print(output) 

            cv2.imwrite('./pool_output/'+poolingOption+'/'+filename+'_out.jpg', output)

if __name__ == '__main__':
    filenameList = ['flower', 'line','windflower']

    poolingImage(filenameList,'max')
    poolingImage(filenameList,'avg')
    