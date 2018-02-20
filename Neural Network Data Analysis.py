# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""Example code for TensorFlow Wide & Deep Tutorial using TF.Learn API."""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import shutil
import sys

import tensorflow as tf

_CSV_COLUMNS = [
    'price', 'bedrooms', 'bathrooms','sqft_living',
    'sqft_lot', 'floors', 'waterfront', 'view','condition',
    'grade','sqft_above' ,'sqft_basement', 'yr_built','yr_renovated',
    "zipcode", "lat","long","sqft_living15","sqft_lot15",
    "priceClass"
]

_CSV_COLUMN_DEFAULTS = [[0.0],[0],[0.0],[0],
                        [0],[0.0],[''],[0],[0],
                        [0],[0],[0],[0],[0],
                        [0],[0.0],[0.0],[0],[0],
                        ['']]


parser = argparse.ArgumentParser()

parser.add_argument(
    '--model_dir', type=str, default='/Users/David Burkhalter/Desktop/Data analytics/python stuff/Deep/deep_long',
    help='Base directory for the model.')

parser.add_argument(
    '--model_type', type=str, default='wide_deep',
    help="Valid model types: {'wide', 'deep', 'wide_deep'}.")

parser.add_argument(
    '--train_epochs', type=int, default=500, help='Number of training epochs.')

parser.add_argument(
    '--epochs_per_eval', type=int, default=5,
    help='The number of training epochs to run between evaluations.')

parser.add_argument(
    '--batch_size', type=int, default=40, help='Number of examples per batch.')

parser.add_argument(
    '--train_data', type=str, default='/Users/David Burkhalter/Desktop/Data analytics/python stuff/data/trainSet.csv',
    help='Path to the training data.')

parser.add_argument(
    '--test_data', type=str, default='/Users/David Burkhalter/Desktop/Data analytics/python stuff/data/testSet.csv',
    help='Path to the test data.')

_NUM_EXAMPLES = {
    'train': 10806,
    'validation': 10807,
}


def build_model_columns():
  """Builds a set of wide and deep feature columns."""
  # Continuous columns
  bedrooms = tf.feature_column.numeric_column('bedrooms')
  bathrooms = tf.feature_column.numeric_column('bathrooms')
  sqft_living = tf.feature_column.numeric_column('sqft_living')
  sqft_lot = tf.feature_column.numeric_column('sqft_lot')
  floors = tf.feature_column.numeric_column('floors')
  view = tf.feature_column.numeric_column('view')
  condition = tf.feature_column.numeric_column('condition')
  grade = tf.feature_column.numeric_column('grade')
  sqft_above = tf.feature_column.numeric_column('sqft_above')
  sqft_below = tf.feature_column.numeric_column('sqft_basement')
  year_built = tf.feature_column.numeric_column('yr_built')
  year_reno = tf.feature_column.numeric_column('yr_renovated')
  lat = tf.feature_column.numeric_column('lat')
  longitude = tf.feature_column.numeric_column('long')

  waterfront = tf.feature_column.categorical_column_with_vocabulary_list(
    'waterfront',['true','false'])

  zipcode = tf.feature_column.categorical_column_with_vocabulary_list(
      'zipcode', [
          98001,98002,98003,98004,98005,98006,98007,98008,
          98010,98011,98014,98019,98022,98023,98024,98027,
          98028,98029,98030,98031,98032,98033,98034,98038,
          98039,98040,98042,98045,98052,98053,98055,98056,
          98058,98059,98065,98070,98072,98074,98075,98077,
          98092,98102,98103,98105,98106,98107,98108,98109,
          98112,98115,98116,98117,98118,98119,98122,98125,
          98126,98133,98136,98144,98146,98148,98155,98166,
          98168,98177,98178,98188,98198,98199])


  # Wide columns and deep columns.
  base_columns = [
    bedrooms,
    bathrooms,
    sqft_living,
    sqft_lot,
    floors,
    view,
    condition,
    grade,
    sqft_above,
    sqft_below,
    year_built,
    year_reno,
    lat,
    longitude,
    tf.feature_column.indicator_column(zipcode),
    tf.feature_column.indicator_column(waterfront)
  ]

  wide_columns = base_columns

  deep_columns = [
    bedrooms,
    bathrooms,
    sqft_living,
    sqft_lot,
    floors,
    view,
    condition,
    grade,
    sqft_above,
    sqft_below,
    year_built,
    year_reno,
    lat,
    longitude,
    tf.feature_column.indicator_column(zipcode),
    tf.feature_column.indicator_column(waterfront)
  ]

  return wide_columns, deep_columns


def build_estimator(model_dir, model_type):
  """Build an estimator appropriate for the given model type."""
  wide_columns, deep_columns = build_model_columns()
  hidden_units = [100, 75, 50, 25]

  # Create a tf.estimator.RunConfig to ensure the model is run on CPU, which
  # trains faster than GPU for this model.
  run_config = tf.estimator.RunConfig().replace(
      session_config=tf.ConfigProto(device_count={'GPU': 0}))

  if model_type == 'wide':
    return tf.estimator.LinearClassifier(
        model_dir=model_dir,
        feature_columns=wide_columns,
        config=run_config)
  elif model_type == 'deep':
    return tf.estimator.DNNClassifier(
        model_dir=model_dir,
        feature_columns=deep_columns,
        hidden_units=hidden_units,
        config=run_config)
  else:
    return tf.estimator.DNNLinearCombinedClassifier(
        model_dir=model_dir,
        linear_feature_columns=wide_columns,
        dnn_feature_columns=deep_columns,
        dnn_hidden_units=hidden_units,
        config=run_config)


def input_fn(data_file, num_epochs, shuffle, batch_size):
  """Generate an input function for the Estimator."""
  assert tf.gfile.Exists(data_file), (
      '%s not found. Please make sure you have either run data_download.py or '
      'set both arguments --train_data and --test_data.' % data_file)

  def parse_csv(value):
    print('Parsing', data_file)
    columns = tf.decode_csv(value, record_defaults=_CSV_COLUMN_DEFAULTS)
    features = dict(zip(_CSV_COLUMNS, columns))
    labels = features.pop('price')
    return features, tf.greater(labels, 540088.1)

  # Extract lines from input files using the Dataset API.
  dataset = tf.data.TextLineDataset(data_file)

  if shuffle:
    dataset = dataset.shuffle(buffer_size=_NUM_EXAMPLES['train'])

  dataset = dataset.map(parse_csv, num_parallel_calls=5)
  # We call repeat after shuffling, rather than before, to prevent separate
  # epochs from blending together.
  dataset = dataset.repeat(num_epochs)
  dataset = dataset.batch(batch_size)

  iterator = dataset.make_one_shot_iterator()
  features, labels = iterator.get_next()
  return features, labels


def main(unused_argv):
  # Clean up the model directory if present
  shutil.rmtree(FLAGS.model_dir, ignore_errors=True)
  model = build_estimator(FLAGS.model_dir, FLAGS.model_type)

  # Train and evaluate the model every `FLAGS.epochs_per_eval` epochs.
  for n in range(FLAGS.train_epochs // FLAGS.epochs_per_eval):
    model.train(input_fn=lambda: input_fn(
        FLAGS.train_data, FLAGS.epochs_per_eval, True, FLAGS.batch_size))

    results = model.evaluate(input_fn=lambda: input_fn(
        FLAGS.test_data, 1, False, FLAGS.batch_size))

    # Display evaluation metrics
    print('Results at epoch', (n + 1) * FLAGS.epochs_per_eval)
    print('-' * 60)

    for key in sorted(results):
      print('%s: %s' % (key, results[key]))


if __name__ == '__main__':
  tf.logging.set_verbosity(tf.logging.INFO)
  FLAGS, unparsed = parser.parse_known_args()
  tf.app.run(main=main, argv=[sys.argv[0]]+ unparsed)
