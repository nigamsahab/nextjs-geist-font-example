import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

# Generate synthetic data for demonstration
def generate_data(n_samples=1000):
    np.random.seed(42)
    
    screen_time = np.random.uniform(1, 12, n_samples)  # hours per day
    unlocks = np.random.randint(20, 300, n_samples)    # times per day
    social_media = np.random.uniform(0, 8, n_samples)  # hours per day
    
    # Define addiction risk based on features
    risk = []
    for st, ul, sm in zip(screen_time, unlocks, social_media):
        if st < 4 and ul < 100 and sm < 2:
            risk.append("Low")
        elif st > 8 or ul > 200 or sm > 5:
            risk.append("High")
        else:
            risk.append("Medium")
    
    return np.column_stack((screen_time, unlocks, social_media)), np.array(risk)

def main():
    # Generate synthetic data
    X, y = generate_data()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_train_encoded = label_encoder.fit_transform(y_train)
    y_test_encoded = label_encoder.transform(y_test)
    
    # Convert to categorical
    y_train_cat = tf.keras.utils.to_categorical(y_train_encoded)
    y_test_cat = tf.keras.utils.to_categorical(y_test_encoded)
    
    # Build model
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(3,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(3, activation='softmax')
    ])
    
    # Compile model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train model
    history = model.fit(
        X_train_scaled,
        y_train_cat,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        verbose=1
    )
    
    # Evaluate model
    test_loss, test_accuracy = model.evaluate(X_test_scaled, y_test_cat, verbose=0)
    print(f"\nTest accuracy: {test_accuracy:.4f}")
    
    # Save model
    model.save('smartphone_addiction_model')
    print("\nModel saved successfully!")

if __name__ == "__main__":
    main()
