export const mockModels = {
    "models": [
        {
            "createAt": 1591465641920,
            "dataset": {
                "label": [
                    "person",
                    "bicycle",
                    "car",
                    "motorcycle",
                    "airplane",
                    "bus",
                    "train",
                    "truck",
                    "boat",
                    "traffic light",
                    "fire hydrant",
                    "stop sign",
                    "parking meter",
                    "bench",
                    "bird",
                    "cat",
                    "dog",
                    "horse",
                    "sheep",
                    "cow",
                    "elephant",
                    "bear",
                    "zebra",
                    "giraffe",
                    "backpack",
                    "umbrella",
                    "handbag",
                    "tie",
                    "suitcase",
                    "frisbee",
                    "skis",
                    "snowboard",
                    "sports ball",
                    "kite",
                    "baseball bat",
                    "baseball glove",
                    "skateboard",
                    "surfboard",
                    "tennis racket",
                    "bottle",
                    "wine glass",
                    "cup",
                    "fork",
                    "knife",
                    "spoon",
                    "bowl",
                    "banana",
                    "apple",
                    "sandwich",
                    "orange",
                    "broccoli",
                    "carrot",
                    "hot dog",
                    "pizza",
                    "donut",
                    "cake",
                    "chair",
                    "couch",
                    "potted plant",
                    "bed",
                    "dining table",
                    "toilet",
                    "tv",
                    "laptop",
                    "mouse",
                    "remote",
                    "keyboard",
                    "cell phone",
                    "microwave",
                    "oven",
                    "toaster",
                    "sink",
                    "refrigerator",
                    "book",
                    "clock",
                    "vase",
                    "scissors",
                    "teddy bear",
                    "hair drier",
                    "toothbrush"
                ],
                "name": "coco",
                "path": "/content/drive/My Drive/OWL/ML/ObjectDetection/CenterNet/data/"
            },
            "deploy": "true",
            "id": "ctdet_coco_dla_2x",
            "modelConfig": {
                "batch_size": 128,
                "learning_rate": 0.09157819444,
                "master_batch": 9,
                "num_epochs": 230
            },
            "name": "ctdet_coco_dla_2x",
            "path": "/content/drive/My Drive/OWL/ML/ObjectDetection/CenterNet/models/ctdet_coco_dla_2x.pth",
            "status": "trained",
            "type": "CenterNet"
        },
        {
            "createAt": 1591629887097,
            "dataset": {
                "label": [
                    "fami"
                ],
                "name": "fami",
                "path": "/content/drive/My Drive/OWL/ML/ObjectDetection/CenterNet/data/"
            },
            "deploy": "false",
            "id": "2fd90fcea99c11ea97770242ac1c0002",
            "modelConfig": {
                "batch_size": 1,
                "learning_rate": 0.000125,
                "master_batch": 1,
                "num_epochs": 10
            },
            "name": "model_fami",
            "path": "/content/drive/My Drive/OWL/ML/ObjectDetection/CenterNet/models/model_fami@2fd90fcea99c11ea97770242ac1c0002.pth",
            "status": "trained",
            "type": "CenterNet"
        }
    ]
}

export const mockTasks = [
    {
      name:'vinfast',
      createAt: 1591465641920,
      type:'CenterNet',
      model:'ctdet_coco_dla_2x',
      status:'Done'
    },
    {
      name:'fami',
      createAt: 1591465641920,
      type:'CenterNet',
      model:'ctdet_coco_dla_2x',
      status:'Pending'
    }
  ]