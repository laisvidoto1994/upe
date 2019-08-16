# -*- coding: utf-8 -*-
"""
Created on Sat Aug 10 14:51:23 2019

@author: pos
"""

import tensorflow as tf

oi = tf.constant('hello, tensorflow!')

sess = tf.Session()

print(sess.run(oi))




