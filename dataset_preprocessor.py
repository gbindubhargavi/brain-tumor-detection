import os
import splitfolders

def preprocess_dataset():
    """Preprocess the dataset by splitting into train/val folders"""
    input_folder = 'dataset'
    output_folder = 'processed_dataset'
    
    # Split with a ratio of 80% train, 20% validation
    splitfolders.ratio(
        input_folder,
        output=output_folder,
        seed=42,
        ratio=(0.8, 0.2),
        group_prefix=None,
        move=False
    )
    
    print(f"Dataset processed and saved to {output_folder}")
    return output_folder

if __name__ == '__main__':
    preprocess_dataset()