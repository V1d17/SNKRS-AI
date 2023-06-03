# shoegenerator/views.py

from matplotlib import pyplot as plt
from rest_framework.views import APIView
from rest_framework.response import Response
from torch import randn
import numpy as np
from keras.models import load_model
from PIL import Image
import io
import base64
import tensorflow as tf
from super_image import PanModel, ImageLoader



def process_indexes(color, company):
        
        company.lower()
        companies={
            'nike':0,
            'adidas':1,
            'puma':2,
        }
        colors={
            'white':0,
            'black':1,
            'red':2,
            'blue':3,
            'green':4,
            'yellow':5,
        }
        return colors[color.lower()],companies[company.lower()]

def process_images(images):
    imgs = []
    for i in images:
        arr = np.array(i)
        
        # Convert to integers in the range [0, 255] if necessary
        if arr.dtype != 'uint8':
            arr = (arr * 255).astype('uint8')
        
        # Convert grayscale images to 3 color channels
        if len(arr.shape) == 2:
            arr = np.stack((arr,)*3, axis=-1)
        
        
        img = Image.fromarray(arr)
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        img_str = f"data:image/jpeg;base64,{img_str}"
        imgs.append(img_str)
    return imgs

def generate_latent_points(latent_dim, n_samples, desired_class = 0,desired_class2=4):
    # generate points in the latent space
    x_input = randn(latent_dim * n_samples)
    # reshape into a batch of inputs for the network
    z_input = x_input.reshape(n_samples, latent_dim)
    # generate labels
    labels = np.full(shape=(n_samples,), fill_value=desired_class)
    colors = np.full(shape=(n_samples,), fill_value=desired_class2)
    return [z_input, labels,colors]



class ShoeGeneratorView(APIView):

    model = load_model('/Users/viditshah/Developement/CS 389/FInal Proj/cgan_generator_with_colors.h5')

    def post(self, request):
        company = request.data.get('company')
        color = request.data.get('color')

        color_ind, company_ind = process_indexes(color, company)
        print(color_ind, company_ind)
        # Process the company and color inputs and create a suitable input for your model
        latent_points, labels,colors = generate_latent_points(100, 100, company_ind,color_ind)
        latent_points = tf.cast(latent_points, tf.float32)
        labels = tf.cast(labels, tf.float32)
        colors = tf.cast(colors, tf.float32)
        # Generate the shoe images
        images = self.model.predict([latent_points, labels,colors])
        #display image 1
        
        images = (images + 1) / 2.0
        # Process the images and convert them to URLs or some format you can return
        

        image_urls = process_images(images)

        return Response({ 'images': image_urls })
